import { CONFIG } from '../config/constants';
import type { TokenCollection } from '../types';

// ---------------------------------------------------------------------------
// Internal helpers (build-time only, not emitted into the output file)
// ---------------------------------------------------------------------------

/** Extract a primitive value from a W3C token object or a bare value. */
function unwrap(token: any): any {
  if (token !== null && typeof token === 'object' && 'value' in token) {
    return token.value;
  }
  return token;
}

/**
 * Build a CSS box-shadow string from a shadow object.
 * Resolves color aliases within the shadow string.
 */
function buildShadowString(shadow: any, colorMap: Record<string, string>): string {
  if (typeof shadow === 'string') {
    // Resolve any color aliases in the string
    return shadow.replace(/\{color\.([^}]+)\}/g, (_, colorKey) => colorMap[colorKey] || `{color.${colorKey}}`);
  }
  if (!shadow || typeof shadow !== 'object') return '';

  const getVal = (key: string): string | number | undefined => {
    const v = shadow[key];
    if (v === undefined) return undefined;
    if (typeof v === 'object' && v !== null && 'value' in v) {
      let val = v.value;
      // Resolve color aliases
      if (typeof val === 'string' && val.startsWith('{color.')) {
        const colorKey = val.slice(7, -1);
        val = colorMap[colorKey] || val;
      }
      return val;
    }
    return v;
  };

  const x = getVal('x') ?? 0;
  const y = getVal('y') ?? 0;
  const blur = getVal('blur') ?? 0;
  const spread = getVal('spread');
  let color = getVal('color');

  // Resolve color if it's still an alias string
  if (typeof color === 'string' && color.startsWith('{color.')) {
    const colorKey = color.slice(7, -1);
    color = colorMap[colorKey] || color;
  }

  if (!color) return JSON.stringify(shadow);

  // FIX: Always add px to spread when it exists (even if it's a number)
  const spreadStr = spread !== undefined && spread !== '' ? ` ${spread}px` : '';
  return `${x}px ${y}px ${blur}px${spreadStr} ${color}`;
}

/**
 * Build a flat map from a category in rawSchema.global.
 */
function buildFlatMap(node: any): Record<string, any> {
  const result: Record<string, any> = {};
  if (!node || typeof node !== 'object') return result;

  for (const [key, val] of Object.entries(node)) {
    if (val !== null && typeof val === 'object' && 'value' in val) {
      result[key] = unwrap(val);
    } else if (val !== null && typeof val === 'object') {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Convert dot-joined flat keys into camelCase Tamagui token names.
 */
function dotToCamel(dotKey: string): string {
  return dotKey
    .replace(/\.([a-zA-Z])/g, (_, c) => c.toUpperCase())
    .replace(/\s+([a-zA-Z])/g, (_, c) => c.toUpperCase());
}

/**
 * Build a Tamagui-compatible numeric scale from raw token entries.
 * Ensures the mandatory `true` key always exists.
 */
function buildScale(
  rawEntries: Array<[string, any]>,
  fallbackTrueKey = '4',
): Record<string, number | string> {
  const scale: Record<string, number | string> = {};

  for (const [key, token] of rawEntries) {
    const raw = unwrap(token);
    if (raw === undefined || raw === null) continue;
    const num = Number(raw);
    scale[key] = isNaN(num) ? String(raw) : num;
  }

  if (!('true' in scale)) {
    scale.true = scale[fallbackTrueKey] ?? 16;
  }

  return scale;
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export function buildTamagui(globals: TokenCollection, rawSchema?: any): string {
  // ------------------------------------------------------------------
  // 0. Determine data source
  // ------------------------------------------------------------------

  const hasRawSchema = rawSchema && typeof rawSchema === 'object' && rawSchema.global;

  if (!hasRawSchema) {
    console.warn('[buildTamagui] rawSchema not provided or invalid. Falling back to globals (limited functionality).');
  }

  const global = hasRawSchema ? rawSchema.global : {};
  const rawLight = hasRawSchema ? rawSchema.light?.theme : {};
  const rawDark = hasRawSchema ? rawSchema.dark?.theme : {};

  // ------------------------------------------------------------------
  // 1. Build ALL primitive maps from global
  // ------------------------------------------------------------------

  // Colors
  const colorMap: Record<string, string> = {};
  if (globals.colors && Object.keys(globals.colors).length > 0) {
    for (const [key, val] of Object.entries(globals.colors)) {
      colorMap[key] = String(val);
    }
  } else {
    for (const [key, val] of Object.entries(global.color ?? {})) {
      const unwrapped = unwrap(val);
      colorMap[key] = typeof unwrapped === 'string' ? unwrapped : String(unwrapped);
    }
  }

  // Shadows
  const shadowMap: Record<string, any> = {};
  for (const [key, val] of Object.entries(global.shadow ?? {})) {
    shadowMap[key] = val;
  }

  // Opacity
  const opacityMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.opacity ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) opacityMap[key] = Number(unwrapped);
  }

  // Border width
  const borderWidthMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.borderWidth ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) borderWidthMap[key] = Number(unwrapped);
  }

  // Space
  const spaceMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.space ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) spaceMap[key] = Number(unwrapped);
  }

  // Size
  const sizeMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.size ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) sizeMap[key] = Number(unwrapped);
  }

  // Radius
  const radiusMap: Record<string, number | string> = {};
  for (const [key, val] of Object.entries(global.radius ?? {})) {
    const raw = unwrap(val);
    if (raw !== undefined) {
      radiusMap[key] = isNaN(Number(raw)) ? String(raw) : Number(raw);
    }
  }

  // zIndex
  const zIndexMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.zIndex ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) zIndexMap[key] = Number(unwrapped);
  }

  // Motion
  const motionMap: Record<string, Record<string, any>> = {};
  for (const [key, val] of Object.entries(global.motion ?? {})) {
    if (val !== null && typeof val === 'object') {
      motionMap[key] = buildFlatMap(val);
    }
  }

  // Screens
  const screensMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.screens ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) screensMap[key] = Number(unwrapped);
  }

  // Font family
  const fontFamilyMap: Record<string, string> = {};
  for (const [key, val] of Object.entries(global.fontFamily ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) fontFamilyMap[key] = String(unwrapped);
  }

  // Font weight
  const fontWeightMap: Record<string, string> = {};
  for (const [key, val] of Object.entries(global.fontWeight ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) fontWeightMap[key] = String(unwrapped);
  }

  // Font size
  const fontSizeMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.fontSize ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) fontSizeMap[key] = Number(unwrapped);
  }

  // Line height
  const lineHeightMap: Record<string, number> = {};
  for (const [key, val] of Object.entries(global.lineHeight ?? {})) {
    const unwrapped = unwrap(val);
    if (unwrapped !== undefined) lineHeightMap[key] = Number(unwrapped);
  }

  // Typography presets
  const typographyMap: Record<string, any> = {};
  for (const [key, val] of Object.entries(global.typography ?? {})) {
    if (val !== null && typeof val === 'object') {
      typographyMap[key] = {};
      for (const [prop, propVal] of Object.entries(val as object)) {
        if (propVal !== null && typeof propVal === 'object' && 'value' in propVal) {
          let resolved = unwrap(propVal);
          // Resolve aliases in typography presets
          if (typeof resolved === 'string' && resolved.startsWith('{') && resolved.endsWith('}')) {
            const aliasPath = resolved.slice(1, -1);
            const parts = aliasPath.split('.');
            if (parts.length >= 2) {
              const category = parts[0];
              const tokenName = parts[1];
              if (category === 'fontFamily' && fontFamilyMap[tokenName]) {
                resolved = fontFamilyMap[tokenName];
              } else if (category === 'fontWeight' && fontWeightMap[tokenName]) {
                resolved = fontWeightMap[tokenName];
              } else if (category === 'fontSize' && fontSizeMap[tokenName]) {
                resolved = fontSizeMap[tokenName];
              } else if (category === 'lineHeight' && lineHeightMap[tokenName]) {
                resolved = lineHeightMap[tokenName];
              }
            }
          }
          typographyMap[key][prop] = resolved;
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // 2. Helper: resolve any alias reference
  // ------------------------------------------------------------------

  function resolveValue(value: any, context: 'light' | 'dark', themeTokens: Record<string, any>): any {
    if (typeof value !== 'string') return value;
    if (!value.startsWith('{') || !value.endsWith('}')) return value;

    const path = value.slice(1, -1);
    const parts = path.split('.');

    if (parts.length < 2) return value;

    const category = parts[0];
    const remaining = parts.slice(1);

    // Direct primitive lookups
    if (category === 'color' && remaining.length === 1) {
      return colorMap[remaining[0]] ?? value;
    }
    if (category === 'shadow' && remaining.length === 1) {
      const shadow = shadowMap[remaining[0]];
      return shadow ? buildShadowString(shadow, colorMap) : value;
    }
    if (category === 'opacity' && remaining.length === 1) {
      return opacityMap[remaining[0]] ?? value;
    }
    if (category === 'borderWidth' && remaining.length === 1) {
      return borderWidthMap[remaining[0]] ?? value;
    }
    if (category === 'space' && remaining.length === 1) {
      return spaceMap[remaining[0]] ?? value;
    }
    if (category === 'size' && remaining.length === 1) {
      return sizeMap[remaining[0]] ?? value;
    }
    if (category === 'radius' && remaining.length === 1) {
      return radiusMap[remaining[0]] ?? value;
    }
    if (category === 'fontSize' && remaining.length === 1) {
      return fontSizeMap[remaining[0]] ?? value;
    }
    if (category === 'lineHeight' && remaining.length === 1) {
      return lineHeightMap[remaining[0]] ?? value;
    }
    if (category === 'fontWeight' && remaining.length === 1) {
      return fontWeightMap[remaining[0]] ?? value;
    }
    if (category === 'fontFamily' && remaining.length === 1) {
      return fontFamilyMap[remaining[0]] ?? value;
    }

    // Theme cross-references: {border.default}, {theme.bg.surface}
    if (category === 'border' && remaining.length === 1) {
      const themeKey = 'border' + remaining[0].charAt(0).toUpperCase() + remaining[0].slice(1);
      return themeTokens[themeKey] ?? value;
    }
    if (category === 'theme' && remaining.length >= 2) {
      const themeKeyCamel = remaining[0] + remaining.slice(1).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
      return themeTokens[themeKeyCamel] ?? value;
    }

    return value;
  }

  // ------------------------------------------------------------------
  // 3. Flatten theme tokens with full alias resolution
  // ------------------------------------------------------------------

  function flattenTheme(
    node: any,
    context: 'light' | 'dark',
    themeTokens: Record<string, any>,
    prefix = '',
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, val] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;

      if (val !== null && typeof val === 'object' && 'value' in val && 'type' in val) {
        const rawValue = val.value;
        const tokenType = val.type;

        if (tokenType === 'boxShadow') {
          if (typeof rawValue === 'string') {
            const resolved = resolveValue(rawValue, context, themeTokens);
            if (typeof resolved === 'string' && resolved.startsWith('{')) {
              result[path] = resolved;
            } else if (typeof resolved === 'object' && resolved !== null) {
              result[path] = buildShadowString(resolved, colorMap);
            } else {
              result[path] = String(resolved);
            }
          } else if (typeof rawValue === 'object' && rawValue !== null) {
            if ('x' in rawValue || 'y' in rawValue || 'blur' in rawValue) {
              result[path] = buildShadowString(rawValue, colorMap);
            } else {
              Object.assign(result, flattenTheme(rawValue, context, themeTokens, path));
            }
          }
        } else if (tokenType === 'typography' && typeof rawValue === 'string') {
          const resolved = resolveValue(rawValue, context, themeTokens);
          if (typeof resolved === 'string' && resolved.startsWith('{')) {
            const presetName = resolved.slice(1, -1).replace('typography.', '');
            result[path] = typographyMap[presetName] ?? resolved;
          } else {
            result[path] = resolved;
          }
        } else {
          if (typeof rawValue === 'string') {
            result[path] = resolveValue(rawValue, context, themeTokens);
          } else {
            result[path] = rawValue;
          }
        }
      } else if (val !== null && typeof val === 'object') {
        const hasShadowProps = ['x', 'y', 'blur', 'color'].some(p => p in (val as object));
        if (hasShadowProps && !('value' in (val as object))) {
          result[path] = buildShadowString(val, colorMap);
        } else {
          Object.assign(result, flattenTheme(val, context, themeTokens, path));
        }
      }
    }

    return result;
  }

  // First pass: flatten without cross-references
  const lightFlat1 = flattenTheme(rawLight, 'light', {});
  const darkFlat1 = flattenTheme(rawDark, 'dark', {});

  // Convert to camelCase
  let lightTokens: Record<string, any> = Object.fromEntries(
    Object.entries(lightFlat1).map(([k, v]) => [dotToCamel(k), v])
  );
  let darkTokens: Record<string, any> = Object.fromEntries(
    Object.entries(darkFlat1).map(([k, v]) => [dotToCamel(k), v])
  );

  // Second pass: resolve cross-references
  function resolveCrossReferences(tokens: Record<string, any>, context: 'light' | 'dark'): Record<string, any> {
    const resolved: Record<string, any> = {};
    for (const [key, val] of Object.entries(tokens)) {
      if (typeof val === 'string' && val.startsWith('{')) {
        resolved[key] = resolveValue(val, context, tokens);
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        resolved[key] = {};
        for (const [k, v] of Object.entries(val)) {
          if (typeof v === 'string' && v.startsWith('{')) {
            resolved[key][k] = resolveValue(v, context, tokens);
          } else {
            resolved[key][k] = v;
          }
        }
      } else {
        resolved[key] = val;
      }
    }
    return resolved;
  }

  lightTokens = resolveCrossReferences(lightTokens, 'light');
  darkTokens = resolveCrossReferences(darkTokens, 'dark');

  // Third pass: deep string resolution (including within shadow strings)
  function deepResolveStrings(obj: any, context: 'light' | 'dark', themeTokens: Record<string, any>): any {
    if (typeof obj === 'string') {
      if (obj.includes('{color.')) {
        return obj.replace(/\{color\.([^}]+)\}/g, (_, colorKey) => colorMap[colorKey] || `{color.${colorKey}}`);
      }
      return resolveValue(obj, context, themeTokens);
    }
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const result: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        result[k] = deepResolveStrings(v, context, themeTokens);
      }
      return result;
    }
    return obj;
  }

  lightTokens = deepResolveStrings(lightTokens, 'light', lightTokens);
  darkTokens = deepResolveStrings(darkTokens, 'dark', darkTokens);

  // ------------------------------------------------------------------
  // 4. Typography configuration
  // ------------------------------------------------------------------

  const montserrat = fontFamilyMap['montserrat'] ?? 'Montserrat, sans-serif';
  const jetbrains = fontFamilyMap['jetbrains'] ?? 'JetBrains Mono, Menlo, monospace';

  const fontSizeScale = { ...fontSizeMap };
  if (!('true' in fontSizeScale)) {
    fontSizeScale.true = fontSizeScale.body2 ?? 14;
  }

  const lineHeightScale: Record<string, number> = {
    true: lineHeightMap.body2 ?? 21,
  };
  const fontSizeToLineHeight: Record<string, string> = {
    body1: 'body1', body2: 'body2', body3: 'body3', body4: 'body4',
    heading1: 'heading1', heading2: 'heading2', heading3: 'heading3', heading4: 'heading4',
  };
  for (const [fsKey, lhKey] of Object.entries(fontSizeToLineHeight)) {
    if (fontSizeScale[fsKey] && lineHeightMap[lhKey]) {
      lineHeightScale[fsKey] = lineHeightMap[lhKey];
    }
  }

  const weightScale = { ...fontWeightMap };

  // ------------------------------------------------------------------
  // 5. Motion tokens (convert duration to numbers)
  // ------------------------------------------------------------------
  const durationScale: Record<string, number> = {};
  for (const [key, val] of Object.entries(motionMap.duration ?? {})) {
    durationScale[key] = Number(val);
  }

  const easingScale: Record<string, string> = {};
  for (const [key, val] of Object.entries(motionMap.easing ?? {})) {
    easingScale[key] = String(val);
  }

  // ------------------------------------------------------------------
  // 6. Build font face objects
  // ------------------------------------------------------------------
  const montserratFace: Record<string, { normal: string; italic?: string }> = {};
  if (weightScale.regular) {
    montserratFace[weightScale.regular] = { normal: 'Montserrat-Regular', italic: 'Montserrat-Italic' };
  }
  if (weightScale.medium) {
    montserratFace[weightScale.medium] = { normal: 'Montserrat-Medium', italic: 'Montserrat-MediumItalic' };
  }
  if (weightScale.semibold) {
    montserratFace[weightScale.semibold] = { normal: 'Montserrat-SemiBold', italic: 'Montserrat-SemiBoldItalic' };
  }
  if (weightScale.bold) {
    montserratFace[weightScale.bold] = { normal: 'Montserrat-Bold', italic: 'Montserrat-BoldItalic' };
  }
  if (weightScale.black) {
    montserratFace[weightScale.black] = { normal: 'Montserrat-Black', italic: 'Montserrat-BlackItalic' };
  }

  const jetbrainsFace: Record<string, { normal: string }> = {};
  if (weightScale.regular) {
    jetbrainsFace[weightScale.regular] = { normal: 'JetBrainsMono-Regular' };
  }
  if (weightScale.medium) {
    jetbrainsFace[weightScale.medium] = { normal: 'JetBrainsMono-Medium' };
  }
  if (weightScale.bold) {
    jetbrainsFace[weightScale.bold] = { normal: 'JetBrainsMono-Bold' };
  }

  // ------------------------------------------------------------------
  // 7. Separate component tokens from semantic theme tokens
  // ------------------------------------------------------------------

  const lightSemanticFlat: Record<string, any> = {};
  const lightComponentTokens: Record<string, any> = {};
  for (const [key, val] of Object.entries(lightTokens)) {
    if (key.startsWith('component')) {
      lightComponentTokens[key] = val;
    } else {
      lightSemanticFlat[key] = val;
    }
  }

  const darkSemanticFlat: Record<string, any> = {};
  const darkComponentTokens: Record<string, any> = {};
  for (const [key, val] of Object.entries(darkTokens)) {
    if (key.startsWith('component')) {
      darkComponentTokens[key] = val;
    } else {
      darkSemanticFlat[key] = val;
    }
  }

  // ------------------------------------------------------------------
  // 8. Build scales with mandatory true key
  // ------------------------------------------------------------------
  const spaceScale = buildScale(Object.entries(global.space ?? {}), '4');
  const sizeScale = buildScale(Object.entries(global.size ?? {}), '4');
  const radiusScale = buildScale(Object.entries(global.radius ?? {}), '2');
  const zIndexScale = buildScale(Object.entries(global.zIndex ?? {}), 'base');

  // ------------------------------------------------------------------
  // 9. Emit the generated file
  // ------------------------------------------------------------------

  const colorTokensJson = JSON.stringify(colorMap, null, 2);
  const spaceScaleJson = JSON.stringify(spaceScale, null, 2);
  const sizeScaleJson = JSON.stringify(sizeScale, null, 2);
  const radiusScaleJson = JSON.stringify(radiusScale, null, 2);
  const zIndexScaleJson = JSON.stringify(zIndexScale, null, 2);
  const fontSizeScaleJson = JSON.stringify(fontSizeScale, null, 2);
  const lineHeightScaleJson = JSON.stringify(lineHeightScale, null, 2);
  const lightSemanticJson = JSON.stringify(lightSemanticFlat, null, 2);
  const darkSemanticJson = JSON.stringify(darkSemanticFlat, null, 2);
  const lightComponentJson = JSON.stringify(lightComponentTokens, null, 2);
  const darkComponentJson = JSON.stringify(darkComponentTokens, null, 2);
  const opacityScaleJson = JSON.stringify(opacityMap, null, 2);
  const borderWidthScaleJson = JSON.stringify(borderWidthMap, null, 2);
  const screensScaleJson = JSON.stringify(screensMap, null, 2);
  const durationScaleJson = JSON.stringify(durationScale, null, 2);
  const easingScaleJson = JSON.stringify(easingScale, null, 2);
  const montserratFaceJson = JSON.stringify(montserratFace, null, 2);
  const jetbrainsFaceJson = JSON.stringify(jetbrainsFace, null, 2);

  // FIX: Use single eslint-disable comment
  return (
    CONFIG.warningHeader +
    `/* eslint-disable */
// @ts-nocheck

import { createTamagui, createFont, createTokens } from 'tamagui';

// ---------------------------------------------------------------------------
// Primitive color tokens
// All hex values resolved at build time — no runtime alias look-ups.
// ---------------------------------------------------------------------------
const colorTokens = ${colorTokensJson} as const;

// ---------------------------------------------------------------------------
// Scales
// Each scale includes the mandatory \`true\` key Tamagui requires internally.
// ---------------------------------------------------------------------------
const spaceScale  = ${spaceScaleJson}  as const;
const sizeScale   = ${sizeScaleJson}   as const;
const radiusScale = ${radiusScaleJson} as const;
const zIndexScale = ${zIndexScaleJson} as const;

// ---------------------------------------------------------------------------
// Additional primitive scales (borderWidth, opacity)
// ---------------------------------------------------------------------------
const borderWidthScale = ${borderWidthScaleJson} as const;
const opacityScale = ${opacityScaleJson} as const;

// ---------------------------------------------------------------------------
// Breakpoints / Media queries
// ---------------------------------------------------------------------------
const media = {
  sm: { maxWidth: ${screensMap.sm ?? 640} },
  md: { maxWidth: ${screensMap.md ?? 768} },
  lg: { maxWidth: ${screensMap.lg ?? 1024} },
  xl: { maxWidth: ${screensMap.xl ?? 1280} },
  '2xl': { maxWidth: ${screensMap['2xl'] ?? 1536} },
  gtSm: { minWidth: ${(screensMap.sm ?? 640) + 1} },
  gtMd: { minWidth: ${(screensMap.md ?? 768) + 1} },
  gtLg: { minWidth: ${(screensMap.lg ?? 1024) + 1} },
  gtXl: { minWidth: ${(screensMap.xl ?? 1280) + 1} },
} as const;

// ---------------------------------------------------------------------------
// Motion / Animation tokens
// ---------------------------------------------------------------------------
const duration = ${durationScaleJson} as const;
const easing = ${easingScaleJson} as const;

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------
const fontSizeScale = ${fontSizeScaleJson} as const;
const lineHeightScale = ${lineHeightScaleJson} as const;

const MontserratFont = createFont({
  family: ${JSON.stringify(montserrat)},
  size:         fontSizeScale,
  lineHeight:   lineHeightScale,
  weight:       { 
    normal: '${weightScale.regular ?? '400'}', 
    medium: '${weightScale.medium ?? '500'}', 
    semibold: '${weightScale.semibold ?? '600'}', 
    bold: '${weightScale.bold ?? '700'}', 
    black: '${weightScale.black ?? '900'}',
    true: '${weightScale.regular ?? '400'}' 
  },
  letterSpacing: { true: 0 },
  face: ${montserratFaceJson},
});

const JetbrainsFont = createFont({
  family: ${JSON.stringify(jetbrains)},
  size:         fontSizeScale,
  lineHeight:   lineHeightScale,
  weight:       { 
    normal: '${weightScale.regular ?? '400'}', 
    medium: '${weightScale.medium ?? '500'}', 
    bold: '${weightScale.bold ?? '700'}',
    true: '${weightScale.regular ?? '400'}' 
  },
  letterSpacing: { true: 0 },
  face: ${jetbrainsFaceJson},
});

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------
const tamaguiTokens = createTokens({
  color:   colorTokens,
  space:   spaceScale,
  size:    sizeScale,
  radius:  radiusScale,
  zIndex:  zIndexScale,
});

// ---------------------------------------------------------------------------
// Semantic theme tokens
// Resolved at build time: all {color.X} aliases replaced with hex values.
// Light and dark themes share the same primitive token set; only the semantic
// layer (background, text, border, etc.) differs between them.
// ---------------------------------------------------------------------------
const lightSemanticTokens = ${lightSemanticJson} as const;
const darkSemanticTokens  = ${darkSemanticJson}  as const;

// ---------------------------------------------------------------------------
// Component tokens (for reference / component configuration)
// These contain objects (typography) and are kept separate from the flat theme.
// ---------------------------------------------------------------------------
const lightComponentTokens = ${lightComponentJson} as const;
const darkComponentTokens = ${darkComponentJson} as const;

// Tamagui themes must be flat objects: every key becomes a CSS-variable-backed
// token usable as a color prop value (e.g. <Text color="$textPrimary" />).
const lightTheme = {
  // Spread primitive colors so all raw palette values are accessible
  ...colorTokens,
  // Semantic layer — these override the primitives where names collide
  ...lightSemanticTokens,
  // Mandatory Tamagui surface tokens
  background:       lightSemanticTokens.bgDefault       ?? colorTokens.white,
  backgroundHover:  lightSemanticTokens.bgSurface       ?? colorTokens.gray50,
  backgroundPress:  lightSemanticTokens.bgElevated      ?? colorTokens.white,
  backgroundFocus:  lightSemanticTokens.bgSurface       ?? colorTokens.gray50,
  color:            lightSemanticTokens.textPrimary     ?? colorTokens.black,
  colorHover:       lightSemanticTokens.textSecondary   ?? colorTokens.gray600,
  colorPress:       lightSemanticTokens.textPrimary     ?? colorTokens.black,
  colorFocus:       lightSemanticTokens.textBrand       ?? colorTokens.azulHorizonte,
  borderColor:      lightSemanticTokens.borderDefault   ?? colorTokens.gray200,
  borderColorHover: lightSemanticTokens.borderStrong    ?? colorTokens.gray400,
  borderColorFocus: lightSemanticTokens.borderFocus     ?? colorTokens.azulHorizonte,
  shadowColor:      colorTokens.black,
  shadowColorHover: colorTokens.black,
};

const darkTheme = {
  ...colorTokens,
  ...darkSemanticTokens,
  background:       darkSemanticTokens.bgDefault        ?? colorTokens.black,
  backgroundHover:  darkSemanticTokens.bgSurface        ?? colorTokens.gray800,
  backgroundPress:  darkSemanticTokens.bgElevated       ?? colorTokens.gray600,
  backgroundFocus:  darkSemanticTokens.bgSurface        ?? colorTokens.gray800,
  color:            darkSemanticTokens.textPrimary      ?? colorTokens.white,
  colorHover:       darkSemanticTokens.textSecondary    ?? colorTokens.gray200,
  colorPress:       darkSemanticTokens.textPrimary      ?? colorTokens.white,
  colorFocus:       darkSemanticTokens.textBrand        ?? colorTokens.azulHorizonte40,
  borderColor:      darkSemanticTokens.borderDefault    ?? colorTokens.gray800,
  borderColorHover: darkSemanticTokens.borderStrong     ?? colorTokens.gray600,
  borderColorFocus: darkSemanticTokens.borderFocus      ?? colorTokens.azulHorizonte,
  shadowColor:      colorTokens.black,
  shadowColorHover: colorTokens.black,
};

// ---------------------------------------------------------------------------
// Final config
// ---------------------------------------------------------------------------
export default createTamagui({
  tokens: tamaguiTokens,
  themes: {
    light: lightTheme,
    dark:  darkTheme,
  },
  fonts: {
    body:    MontserratFont,
    heading: MontserratFont,
    mono:    JetbrainsFont,
  },
  media,
  settings: {
    allowedStyleValues: 'somewhat-strict',
  },
});

// ---------------------------------------------------------------------------
// Exported constants for runtime use (animations, transitions, components)
// ---------------------------------------------------------------------------
export { 
  duration, 
  easing, 
  borderWidthScale, 
  opacityScale, 
  screensScale,
  lightComponentTokens, 
  darkComponentTokens 
};
`
  );
}
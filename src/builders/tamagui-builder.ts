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
 * Resolve a `{color.azulHorizonte}` alias against a flat color map.
 * Returns the hex value when the alias is found, otherwise the raw string.
 */
function resolveAlias(value: string, colorMap: Record<string, string>): string {
  const match = value.match(/^\{color\.([^}]+)\}$/);
  if (match) {
    return colorMap[match[1]] ?? value;
  }
  return value;
}

/**
 * Flatten a nested token object (e.g. `{ bg: { default: { value: '...' } } }`)
 * into a dot-joined key map: `{ 'bg.default': '#fff' }`.
 * Aliases are resolved against `colorMap` when provided.
 */
function flattenThemeTokens(
  node: any,
  colorMap: Record<string, string>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, val] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const primitive = unwrap(val);

    if (primitive !== null && typeof primitive === 'object') {
      // Still nested — recurse
      Object.assign(result, flattenThemeTokens(primitive, colorMap, path));
    } else if (typeof primitive === 'string') {
      result[path] = resolveAlias(primitive, colorMap);
    }
    // skip non-string leaves (e.g. boxShadow objects for elevation)
  }

  return result;
}

/**
 * Convert dot-joined flat keys into camelCase Tamagui token names.
 * `bg.default` → `bgDefault`, `action.primary.bg` → `actionPrimaryBg`
 */
function dotToCamel(dotKey: string): string {
  return dotKey.replace(/\.([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Build a Tamagui-compatible numeric scale from raw token entries.
 * Ensures the mandatory `true` key always resolves to a reasonable default.
 * Non-numeric keys (e.g. `round`) are preserved as-is.
 */
function buildScale(
  rawEntries: Array<[string, any]>,
  fallbackTrueKey = '4',
): Record<string, number | string> {
  const scale: Record<string, number | string> = {};

  for (const [key, token] of rawEntries) {
    const raw = unwrap(token);
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
  // 1. Resolve raw color map from globals (already unwrapped by pipeline)
  // ------------------------------------------------------------------
  const colorMap: Record<string, string> = {};
  for (const [key, val] of Object.entries(globals.colors ?? {})) {
    colorMap[key] = String(val);
  }

  // ------------------------------------------------------------------
  // 2. Build typed scales from the raw schema (preferred) or globals
  // ------------------------------------------------------------------

  // Space: numeric keys 0-10, values in px
  const rawSpace = rawSchema?.global?.space ?? {};
  const spaceScale = buildScale(Object.entries(rawSpace), '4');

  // Radius: numeric keys + 'round'
  const rawRadius = rawSchema?.global?.radius ?? {};
  const radiusScale = buildScale(Object.entries(rawRadius), '2');

  // zIndex: named keys (base, dropdown, sticky, overlay, modal, toast)
  const rawZIndex = rawSchema?.global?.zIndex ?? {};
  const zIndexScale: Record<string, number> = {};
  for (const [key, token] of Object.entries(rawZIndex)) {
    zIndexScale[key] = Number(unwrap(token)) || 0;
  }
  // Tamagui needs 'true' on zIndex too
  if (!('true' in zIndexScale)) {
    zIndexScale.true = zIndexScale.base ?? 0;
  }

  // Size: reuse space scale — Tamagui's `size` tokens drive component sizing
  const sizeScale = { ...spaceScale };

  // ------------------------------------------------------------------
  // 3. Resolve semantic theme tokens (light / dark)
  //    Flatten nested W3C objects → camelCase color map
  // ------------------------------------------------------------------
  const rawLight = rawSchema?.light?.theme ?? {};
  const rawDark  = rawSchema?.dark?.theme  ?? {};

  const lightFlat = flattenThemeTokens(rawLight, colorMap);
  const darkFlat  = flattenThemeTokens(rawDark,  colorMap);

  const lightTokens = Object.fromEntries(
    Object.entries(lightFlat).map(([k, v]) => [dotToCamel(k), v]),
  );
  const darkTokens = Object.fromEntries(
    Object.entries(darkFlat).map(([k, v]) => [dotToCamel(k), v]),
  );

  // ------------------------------------------------------------------
  // 4. Typography — pulled from globals (populated by token-resolution)
  //    Fall back to Figma-spec defaults if the pipeline left them empty
  // ------------------------------------------------------------------
  const fontFamilyMap = globals.typography?.fontFamily ?? {};
  const montserrat =
    String(fontFamilyMap['montserrat'] ?? 'Montserrat, Arial, sans-serif');
  const jetbrains =
    String(fontFamilyMap['jetbrains'] ?? 'JetBrains Mono, Menlo, monospace');

  // Font size — if the pipeline produced values use them, otherwise fall back
  const fontSizeTokens = globals.typography?.fontSize ?? {};
  const hasFontSizes = Object.keys(fontSizeTokens).length > 0;
  const fontSizeScale: Record<string, number> = hasFontSizes
    ? Object.fromEntries(
        Object.entries(fontSizeTokens).map(([k, v]) => [k, Number(v)]),
      )
    : { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, true: 14 };

  if (!('true' in fontSizeScale)) {
    fontSizeScale.true = fontSizeScale.md ?? 14;
  }

  // ------------------------------------------------------------------
  // 5. Emit the generated file
  // ------------------------------------------------------------------

  const colorTokensJson   = JSON.stringify(colorMap,    null, 2);
  const spaceScaleJson    = JSON.stringify(spaceScale,  null, 2);
  const sizeScaleJson     = JSON.stringify(sizeScale,   null, 2);
  const radiusScaleJson   = JSON.stringify(radiusScale, null, 2);
  const zIndexScaleJson   = JSON.stringify(zIndexScale, null, 2);
  const fontSizeScaleJson = JSON.stringify(fontSizeScale, null, 2);
  const lightTokensJson   = JSON.stringify(lightTokens, null, 2);
  const darkTokensJson    = JSON.stringify(darkTokens,  null, 2);

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
// Fonts
// ---------------------------------------------------------------------------
const fontSizeScale = ${fontSizeScaleJson} as const;

const MontserratFont = createFont({
  family: ${JSON.stringify(montserrat)},
  size:         fontSizeScale,
  lineHeight:   { tight: 1.25, normal: 1.5, relaxed: 1.75, true: 1.5 },
  weight:       { normal: '400', medium: '500', semibold: '600', bold: '700', true: '400' },
  letterSpacing: { true: 0 },
  face: {
    400: { normal: 'Montserrat-Regular',   italic: 'Montserrat-Italic' },
    500: { normal: 'Montserrat-Medium',    italic: 'Montserrat-MediumItalic' },
    600: { normal: 'Montserrat-SemiBold',  italic: 'Montserrat-SemiBoldItalic' },
    700: { normal: 'Montserrat-Bold',      italic: 'Montserrat-BoldItalic' },
  },
});

const JetbrainsFont = createFont({
  family: ${JSON.stringify(jetbrains)},
  size:         fontSizeScale,
  lineHeight:   { tight: 1.25, normal: 1.5, relaxed: 1.75, true: 1.5 },
  weight:       { normal: '400', medium: '500', bold: '700', true: '400' },
  letterSpacing: { true: 0 },
  face: {
    400: { normal: 'JetBrainsMono-Regular' },
    500: { normal: 'JetBrainsMono-Medium' },
    700: { normal: 'JetBrainsMono-Bold' },
  },
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
const lightSemanticTokens = ${lightTokensJson} as const;
const darkSemanticTokens  = ${darkTokensJson}  as const;

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
  // Tamagui uses this to namespace CSS variables: --credi-color-*, etc.
  // Remove if your consuming app sets its own prefix via TamaguiProvider.
  // name: 'credi',
  settings: {
    // Allow Tamagui to infer safe areas on native
    allowedStyleValues: 'somewhat-strict',
  },
});
`
  );
}
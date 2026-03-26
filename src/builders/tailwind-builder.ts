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
 * Returns the hex value when the alias is found, otherwise: the raw string.
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
 * Convert dot-joined flat keys into camelCase Tailwind token names.
 * `bg.default` → `bgDefault`, `action.primary.bg` → `actionPrimaryBg`
 */
function dotToCamel(dotKey: string): string {
  return dotKey.replace(/\.([a-z])/g, (_, c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export const buildTailwind = (globals: TokenCollection, rawSchema?: any): string => {
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
  const spaceScale = Object.fromEntries(
    Object.entries(rawSpace).map(([key, token]) => [key, unwrap(token)]),
  );

  // Radius: numeric keys + 'round'
  const rawRadius = rawSchema?.global?.radius ?? {};
  const radiusScale = Object.fromEntries(
    Object.entries(rawRadius).map(([key, token]) => [key, unwrap(token)]),
  );

  // Typography
  const rawTypography = rawSchema?.global?.typography ?? {};
  const typographyScale = {
    fontFamily: rawTypography.fontFamily || {},
    fontSize: rawTypography.fontSize || {},
    lineHeight: rawTypography.lineHeight || {},
    fontWeight: rawTypography.fontWeight || {},
    letterSpacing: rawTypography.letterSpacing || {},
  };

  // ------------------------------------------------------------------
  // 3. Resolve semantic theme tokens (light / dark)
  //    Flatten nested W3C objects → camelCase color map
  // ------------------------------------------------------------------
  const rawLight = rawSchema?.light?.theme ?? {};
  const rawDark  = rawSchema?.dark?.theme  ?? {};

  const lightFlat = flattenThemeTokens(rawLight, colorMap);
  const darkFlat  = flattenThemeTokens(rawDark, colorMap);

  const lightTokens = Object.fromEntries(
    Object.entries(lightFlat).map(([k, v]) => [dotToCamel(k), v]),
  );
  const darkTokens = Object.fromEntries(
    Object.entries(darkFlat).map(([k, v]) => [dotToCamel(k), v]),
  );

  // ------------------------------------------------------------------
  // 4. Build Tailwind-compatible configuration
  // ------------------------------------------------------------------
  const extend: any = {};

  // Colors - map to Tailwind format with proper shades
  if (globals.colors) {
    extend.colors = {};
    for (const [key, value] of Object.entries(globals.colors)) {
      if (typeof value === 'string' && value.startsWith('#')) {
        // Create Tailwind color palette with shades
        extend.colors[key] = {
          50: value,
          100: value,
          200: value,
          300: value,
          400: value,
          500: value,
          600: value,
          700: value,
          800: value,
          900: value,
          DEFAULT: value
        };
      }
    }
  }
  
  // Spacing - ensure proper rem/px conversion
  if (spaceScale) {
    extend.spacing = {};
    for (const [key, value] of Object.entries(spaceScale)) {
      const valueStr = String(value);
      if (valueStr.includes('rem')) {
        extend.spacing[key] = valueStr;
      } else if (typeof value === 'number') {
        extend.spacing[key] = `${value / 16}rem`; // Convert px to rem
      } else {
        extend.spacing[key] = valueStr;
      }
    }
  }
  
  // Typography
  if (typographyScale) {
    extend.fontFamily = typographyScale.fontFamily;
    extend.fontSize = typographyScale.fontSize;
    extend.lineHeight = typographyScale.lineHeight;
    extend.fontWeight = typographyScale.fontWeight;
    if (typographyScale.letterSpacing) {
      extend.letterSpacing = typographyScale.letterSpacing;
    }
  }
  
  // Border radius
  if (radiusScale) {
    extend.borderRadius = radiusScale;
  }

  // ------------------------------------------------------------------
  // 5. Emit the generated file
  // ------------------------------------------------------------------
  return (
    CONFIG.warningHeader +
    `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: { 
    extend: ${JSON.stringify(extend, null, 2)},
    colors: {
      ...${JSON.stringify(extend.colors || {}, null, 2)},
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent'
    }
  },
  plugins: []
};

export default config;`
  );
};

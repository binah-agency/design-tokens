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

  // Simple and robust approach - check if node is a valid object
  if (node && typeof node === 'object') {
    // Get entries safely using Object.entries
    const entries = Object.entries(node);
    
    for (const [key, val] of entries) {
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
  }

  return result;
}

/**
 * Convert dot-joined flat keys into camelCase Mantine token names.
 * `bg.default` → `bgDefault`, `action.primary.bg` → `actionPrimaryBg`
 */
function dotToCamel(dotKey: string): string {
  return dotKey.replace(/\.([a-z])/g, (_, c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Public builders
// ---------------------------------------------------------------------------

export const buildMantineConfig = (globals: TokenCollection, rawSchema?: any): string => {
  // ------------------------------------------------------------------
  // 1. Resolve raw color map from globals (already unwrapped by pipeline)
  // ------------------------------------------------------------------
  const colorMap: Record<string, string> = {};
  for (const [key, val] of Object.entries(globals.colors ?? {} as Record<string, any>)) {
    colorMap[key] = String(val);
  }

  // ------------------------------------------------------------------
  // 2. Build typed scales from the raw schema (preferred) or globals
  // ------------------------------------------------------------------

  // Space
  const rawSpace = rawSchema?.global?.space ?? {};
  const spaceScale = Object.fromEntries(
    Object.entries(rawSpace as Record<string, any>).map(([key, token]) => [key, unwrap(token)] as [string, any]),
  );

  // Radius
  const rawRadius = rawSchema?.global?.radius ?? {};
  const radiusScale = Object.fromEntries(
    Object.entries(rawRadius as Record<string, any>).map(([key, token]) => [key, unwrap(token)] as [string, any]),
  );

  // Typography
  const rawTypography = rawSchema?.global?.typography ?? {};
  const typographyScale = {
    fontFamily: rawTypography.fontFamily || {},
    fontSize: rawTypography.fontSize || {},
    lineHeight: rawTypography.lineHeight || {},
    fontWeight: rawTypography.fontWeight || {},
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
  // 4. Build Mantine theme configuration
  // ------------------------------------------------------------------
  
  // Build colors object for Mantine (with shades)
  const colors = Object.entries(colorMap)
    .filter(([_, v]) => typeof v === 'string' && v.startsWith('#'))
    .reduce((acc, [key, baseColor]) => {
      // Generate color shades for Mantine
      acc[key] = [
        baseColor, // 50 - lightest
        baseColor, // 100
        baseColor, // 200
        baseColor, // 300
        baseColor, // 400
        baseColor, // 500 - base
        baseColor, // 600
        baseColor, // 700
        baseColor, // 800
        baseColor, // 900 - darkest
      ];
      return acc;
    }, {} as Record<string, string[]>);

  // Build spacing
  const spacingMap = Object.entries(spaceScale)
    .reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'number' ? `${value}px` : String(value);
      return acc;
    }, {} as Record<string, string>);

  // Build border radius
  const radius = radiusScale;

  // Build font families
  const fontFamily = typographyScale.fontFamily;

  // Build font sizes
  const fontSizes = typographyScale.fontSize;

  // ------------------------------------------------------------------
  // 5. Emit the generated files
  // ------------------------------------------------------------------
  
  // Theme file
  const themeConfig = {
    colorScheme: 'light',
    primaryColor: colorMap['primary'] ? 'primary' : Object.keys(colorMap)[0],
    defaultRadius: "md",
    white: colorMap.white || '#fff',
    black: colorMap.black || '#000',
    fontFamily: fontFamily.montserrat || 'sans-serif',
    colors,
    fontSizes,
    spacing: spacingMap,
    lineHeight: typographyScale.lineHeight,
    other: {
      borderRadius: {
        xs: radius.xs || '4px',
        sm: radius.sm || '8px',
        md: radius.md || '12px',
        lg: radius.lg || '16px',
        xl: radius.xl || '20px'
      }
    }
  };

  const colorsLines = Object.entries(themeConfig.colors)
    .map(([k, v]) => '    "' + k + '": [' + (v as string[]).map(c => '"' + c + '"').join(', ') + ']')
    .join(',\n');

  const fontSizesLines = Object.entries(themeConfig.fontSizes)
    .map(([k, v]) => '    "' + k + '": ' + JSON.stringify(v))
    .join(',\n');

  return CONFIG.warningHeader +
    'export const mantineTheme: MantineTheme = {\n' +
    '  colorScheme: \'light\',\n' +
    '  primaryColor: "' + themeConfig.primaryColor + '",\n' +
    '  defaultRadius: "' + themeConfig.defaultRadius + '",\n' +
    '  white: "' + themeConfig.white + '",\n' +
    '  black: "' + themeConfig.black + '",\n' +
    '  fontFamily: "' + themeConfig.fontFamily + '",\n' +
    '  colors: {\n' + colorsLines + '\n  },\n' +
    '  fontSizes: {\n' + fontSizesLines + '\n  },\n' +
    '  spacing: ' + JSON.stringify(spacingMap, null, 2) + ',\n' +
    '  lineHeight: ' + JSON.stringify(typographyScale.lineHeight, null, 2) + ',\n' +
    '  other: {\n' +
    '    borderRadius: {\n' +
    '      xs: "' + (themeConfig.other?.borderRadius?.xs || '4px') + '",\n' +
    '      sm: "' + (themeConfig.other?.borderRadius?.sm || '8px') + '",\n' +
    '      md: "' + (themeConfig.other?.borderRadius?.md || '12px') + '",\n' +
    '      lg: "' + (themeConfig.other?.borderRadius?.lg || '16px') + '",\n' +
    '      xl: "' + (themeConfig.other?.borderRadius?.xl || '20px') + '"\n' +
    '    }\n' +
    '  }\n' +
    '};\n\n' +
    'export default mantineTheme;\n';

};

export const buildMantine = (): string => {
  return `${CONFIG.warningHeader}module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
    require('autoprefixer')
  ],
  processOptions: {
    plugins: {
      '@tailwindcss/typography': {
        plugins: ['autoprefixer']
      }
    }
  }
};`;
};

export const buildMantineTypes = (globals: TokenCollection): string => {
  const colorMap = globals.colors || {};
  
  const colors = Object.entries(colorMap)
    .filter(([_, v]) => typeof v === 'string' && v.startsWith('#'))
    .map(([k, v]) => '  ' + k + ': string;')
    .join('\n');
    
  return CONFIG.warningHeader + `export const mantineTheme = {\n` +
    '  colorScheme: \'light\',\n' +
    '  primaryColor: "' + (colorMap['primary'] ? 'primary' : Object.keys(colorMap)[0]) + '",\n' +
    '  defaultRadius: "md",\n' +
    '  white: "' + (colorMap.white || '#fff') + '",\n' +
    '  black: "' + (colorMap.black || '#000') + '",\n' +
    '  fontFamily: "' + (globals.typography?.fontFamily?.montserrat || 'sans-serif') + '",\n' +
    '  colors: {\n' + colors + '\n  },\n' +
    '  spacing: ' + JSON.stringify(globals.spacing || {}, null, 2) + ',\n' +
    '  fontSizes: ' + JSON.stringify(globals.typography?.fontSize || {}, null, 2) + ',\n' +
    '  lineHeights: ' + JSON.stringify(globals.typography?.lineHeight || {}, null, 2) + ',\n' +
    '};\n';
};
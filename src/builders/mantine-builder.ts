import { CONFIG } from '../config/constants';
import type { TokenCollection } from '../types';

export const buildMantineConfig = (globals: TokenCollection): string => {
  const colorMap = globals.colors || {};
  const spacing = globals.spacing || {};
  const typography = globals.typography || {};
  
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
  
  // Build font sizes
  const fontSizes = typography.fontSize || {};
  
  // Build spacing
  const spacingMap = Object.entries(spacing)
    .reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'number' ? `${value}px` : value;
      return acc;
    }, {} as Record<string, string>);
  
  // Build border radius
  const radius = globals.radius || {};
  
  // Build font families
  const fontFamily = typography.fontFamily || {};
  
  return CONFIG.warningHeader + `export const mantineTheme: MantineTheme = {
  colorScheme: 'light',
  primaryColor: "${colorMap['primary'] ? 'primary' : Object.keys(colorMap)[0]}",
  defaultRadius: "md",
  white: "${colorMap.white || '#fff'}",
  black: "${colorMap.black || '#000'}",
  fontFamily: "${fontFamily.montserrat || 'sans-serif'}",
  
  colors: {
${Object.entries(colors)
  .map(([k, v]) => `    "${k}": [${(v as string[]).map(color => `"${color}"`).join(', ')}]`)
  .join(',\n')}
  },
  
  fontSizes: {
${Object.entries(fontSizes)
  .map(([k, v]) => `    "${k}": ${v}`)
  .join(',\n')}
  },
  
  spacing: {
${Object.entries(spacingMap)
  .map(([k, v]) => `    "${k}": "${v}"`)
  .join(',\n')}
  },
  
  lineHeight: ${JSON.stringify(typography.lineHeight || {}, null, 2)},
  
  other: {
    borderRadius: {
      xs: "${radius.xs || '4px'}",
      sm: "${radius.sm || '8px'}",
      md: "${radius.md || '12px'}",
      lg: "${radius.lg || '16px'}",
      xl: "${radius.xl || '20px'}"
    }
  }
};

export default mantineTheme;
`;
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

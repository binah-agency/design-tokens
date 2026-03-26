export const CONFIG = {
  inputPath: './theme.tokens.json',
  outputPaths: {
    css: './dist/css/theme.css',
    tailwind: './dist/tailwind/tailwind.config.ts',
    mantine: './dist/mantine/postcss.config.js',
    mantineConfig: './dist/mantine/mantine.config.ts',
    tamagui: './dist/tamagui/tamagui.config.ts',
    types: './dist/types/mantine.d.ts',
    enterpriseTypes: './dist/types/generated/enterprise-types.ts'
  },
  prefix: 'credi',
  baseFontSize: 16,
  figmaColorMappings: {
    'credi/color/primary/azul-horizonte': '#4585C6',
    'credi/color/primary/azul-horizonte-dark': '#3468A0',
    'credi/color/accent/verde-vitalidad': '#86BD45',
    'credi/color/neutral/white': '#FFFFFF',
    'credi/color/neutral/black': '#2D2D2C',
    'credi/color/neutral/gray200': '#E5E5E5',
    'credi/color/neutral/gray400': '#B5B5B5',
    'credi/color/neutral/gray600': '#7A7A7A',
    'credi/color/neutral/gray800': '#4A4A4A',
    'credi/color/neutral/gray50': '#F7F8F9',
    'credi/color/neutral/overlay': 'rgba(45, 45, 44, 0.6)'
  },
  warningHeader: '/**\n' +
    ' * ⚠️ NO EDITAR DIRECTAMENTE ⚠️\n' +
    ' * Este archivo ha sido generado automáticamente por el Design Token Pipeline.\n' +
    ' * Fuente: theme.tokens.json\n' +
    ' * Cualquier cambio manual será sobrescrito en la próxima compilación.\n' +
    ' * Figma Compliance: v1.0 - Tokens mapeados exactamente desde Figma Design System\n' +
    ' */\n' +
    '/* eslint-disable */\n' +
    '// @ts-nocheck\n'
};

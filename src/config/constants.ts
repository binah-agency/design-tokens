import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  inputPath: path.join(__dirname, '../../theme.tokens.json'),
  outputPaths: {
    css: path.join(__dirname, '../../dist/css/theme.css'),
    tailwind: path.join(__dirname, '../../dist/tailwind/tailwind.config.ts'),
    mantine: path.join(__dirname, '../../dist/mantine/postcss.config.js'),
    mantineConfig: path.join(__dirname, '../../dist/mantine/mantine.config.ts'),
    tamagui: path.join(__dirname, '../../dist/tamagui/tamagui.config.ts'),
    types: path.join(__dirname, '../../dist/types/mantine.d.ts'),
    enterpriseTypes: path.join(__dirname, '../../dist/types/generated/enterprise-types.ts')
  },
  prefix: 'credi',
  baseFontSize: 16,
  figmaColorMappings: {
    'credi/color/primary/azul-horizonte': '#4585C6',
    'credi/color/primary/azul-horizonte-dark': '#3468A0',
    'credi/color/accent/verde-vitalidad': '#86BD45',
    'credi/color/neutral/white': '#FFFFFF',
    'credi/color/neutral/black': '#2D2D2C',
  },
  warningHeader: '/**\n' +
    ' * ⚠️ NO EDITAR DIRECTAMENTE ⚠️\n' +
    ' * Este archivo ha sido generado automáticamente por el Design Token Pipeline.\n' +
    ' * Fuente: theme.tokens.json\n' +
    ' * Cualquier cambio manual será sobrescrito en la próxima compilación.\n' +
    ' * Figma Compliance: v1.0 - Tokens mapeados exactamente desde Figma Design System\n' +
    ' */\n\n' +
    '/* eslint-disable */\n' +
    '// @ts-nocheck\n\n',
};

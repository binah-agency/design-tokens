import { CONFIG } from '../config/constants';

export function buildTamagui(globals: any): string {
  // Extraer las tipografías en tiempo de build para pasarlas a los nombres de las fuentes
  const typographyMap = globals?.typography || {};
  
  // Generar config compatible con createTamagui (plantilla completamente dinámica)
  return CONFIG.warningHeader + `
/* eslint-disable */
// @ts-nocheck

import { createTamagui, createFont, createTokens } from 'tamagui';

// Importar los design tokens globales directamente usando tu alias
import globals from '../../../design-tokens/theme.tokens.json' with { type: 'json' };

/**
 * Helper dinámico para asegurar compatibilidad con Tamagui.
 * Fusiona tus llaves (sm, md, lg) con la escala numérica base que necesita Tamagui internamente,
 * garantizando además que la llave estricta 'true' siempre exista.
 */
const ensureTamaguiScale = (customTokens = {}, baseScale = {}, trueFallbackKey = 'md') => {
  const merged = { ...baseScale, ...customTokens };
  // Tamagui exige estricta y literalmente la llave 'true' en sus tokens
  merged.true = customTokens.true || customTokens[trueFallbackKey] || Object.values(baseScale)[4] || 16;
  return merged;
};

// Escalas numéricas de seguridad para componentes internos de Tamagui
const baseScale = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128 };
const baseRadius = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, round: 9999 };
const baseZIndex = { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 };

// Crear fuentes personalizadas
const MontserratFont = createFont({
  family: "${typographyMap.fontFamily?.montserrat || 'Montserrat, sans-serif'}",
  size: ensureTamaguiScale(globals.typography?.fontSize, baseScale, 'md'),
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  letterSpacing: { true: 0 },
  face: {}
});

const JetbrainsFont = createFont({
  family: "${typographyMap.fontFamily?.jetbrains || 'JetBrains Mono, monospace'}",
  size: ensureTamaguiScale(globals.typography?.fontSize, baseScale, 'md'),
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  letterSpacing: { true: 0 },
  face: {}
});

// Definir tokens válidos combinando la escala de Figma con la escala numérica base
const tamaguiTokens = createTokens({
  size: ensureTamaguiScale(globals.typography?.fontSize, baseScale, 'md'),
  space: ensureTamaguiScale(globals.spacing, baseScale, 'md'),
  radius: ensureTamaguiScale(globals.radius, baseRadius, 'md'),
  zIndex: ensureTamaguiScale(globals.zIndex, baseZIndex, '1'),
  color: { 
    ...globals.colors, 
    primary: globals.colors?.primary || globals.colors?.azulHorizonte || '#4585C6', 
    secondary: globals.colors?.secondary || globals.colors?.verdeVitalidad || '#86BD45', 
    neutral: globals.colors?.neutral || globals.colors?.gray || '#2D2D2C', 
    white: globals.colors?.white || '#FFFFFF', 
    black: globals.colors?.black || '#000000' 
  }
});

// Plantilla base unificada para evitar redundancia de código en los themes
const baseThemeConfig = {
  colors: tamaguiTokens.color,
  spacing: tamaguiTokens.space,
  typography: {
    fontFamily: {
      montserrat: "${typographyMap.fontFamily?.montserrat || 'Montserrat, sans-serif'}",
      jetbrains: "${typographyMap.fontFamily?.jetbrains || 'JetBrains Mono, monospace'}"
    },
    fontSize: tamaguiTokens.size,
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
    letterSpacing: { true: 0 }
  },
  radius: tamaguiTokens.radius,
  opacity: { transparent: 0, semi: 0.5, opaque: 1 },
  zIndex: tamaguiTokens.zIndex,
  borderWidth: { none: 0, thin: 1, thick: 2 },
  size: { icon: 24, avatar: 40, thumbnail: 80 },
  motion: { fast: '150ms', normal: '300ms', slow: '500ms' },
  screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }
};

// Crear themes compatibles para Tamagui
const themes = {
  light: {
    ...baseThemeConfig,
    background: globals.colors?.white || '#FFFFFF',
    color: globals.colors?.black || '#000000',
    // Tamagui espera que todos los colores estén esparcidos en la raíz del theme
    ...tamaguiTokens.color 
  },
  dark: {
    ...baseThemeConfig,
    background: globals.colors?.neutral || globals.colors?.black || '#2D2D2C',
    color: globals.colors?.white || '#FFFFFF',
    ...tamaguiTokens.color
  }
};

// Exportar config final
export default createTamagui({
  tokens: tamaguiTokens,
  themes,
  fonts: {
    body: MontserratFont,
    heading: MontserratFont,
    mono: JetbrainsFont,
  },
  name: 'credi',
});
  `;
}
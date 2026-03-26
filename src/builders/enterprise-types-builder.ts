import { CONFIG } from '../../../../tests/constants';
import type { TokenCollection } from '../types';

export const buildEnterpriseTypes = (globals: TokenCollection): string => {
  // Extraer tokens de colores
  const colorTokens = globals.colors || {};
  const colorKeys = Object.keys(colorTokens);
  
  // Extraer tokens de espaciado
  const spacingTokens = globals.spacing || {};
  const spacingKeys = Object.keys(spacingTokens);
  
  // Extraer tokens de tipografía
  const typographyTokens = globals.typography || {};
  const fontFamilyTokens = typographyTokens.fontFamily || {};
  const fontFamilyKeys = Object.keys(fontFamilyTokens);
  
  // Extraer tokens de radius
  const radiusTokens = globals.radius || {};
  const radiusKeys = Object.keys(radiusTokens);
  
  // Generar tipos literales para colores
  const colorLiteralTypes = colorKeys
    .map(key => `'${key}'`)
    .join(' | ');
  
  // Generar tipos literales para espaciado
  const spacingLiteralTypes = spacingKeys
    .map((key: string) => `'${key}'`)
    .join(' | ');
  
  // Generar tipos literales para font families
  const fontFamilyLiteralTypes = fontFamilyKeys
    .map(key => `'${key}'`)
    .join(' | ');
  
  // Generar tipos literales para radius
  const radiusLiteralTypes = radiusKeys
    .map(key => `'${key}'`)
    .join(' | ');
  
  return CONFIG.warningHeader + `/**
 * Enterprise Literal Types para Crediscore Design System
 * Generado automáticamente desde theme.tokens.json
 * Garantiza type safety estricto en tiempo de compilación
 */

// Tipos literales para colores - PROHÍBE colores hardcoded
export type CrediscoreColor = 
  ${colorLiteralTypes || 'never'};

// Tipos literales para espaciado - PROHÍBE valores hardcoded
export type CrediscoreSpacing = 
  ${spacingLiteralTypes || 'never'};

// Tipos literales para tipografía - PROHÍBE fonts hardcoded
export type CrediscoreFontFamily = 
  ${fontFamilyLiteralTypes || 'never'};

// Tipos literales para border radius - PROHÍBE valores hardcoded
export type CrediscoreRadius = 
  ${radiusLiteralTypes || 'never'};

// Tipos compuestos para uso común
export type CrediscoreSystemToken = 
  | CrediscoreColor
  | CrediscoreSpacing
  | CrediscoreFontFamily
  | CrediscoreRadius;

// Type guards para validación runtime
export const isValidCrediscoreColor = (value: string): value is CrediscoreColor => {
  const validColors = [${colorKeys.map(key => `'${key}'`).join(', ')}];
  return validColors.includes(value);
};

export const isValidCrediscoreSpacing = (value: string): value is CrediscoreSpacing => {
  const validSpacing = [${spacingKeys.map((key: string) => `'${key}'`).join(', ')}];
  return validSpacing.includes(value);
};

export const isValidCrediscoreFontFamily = (value: string): value is CrediscoreFontFamily => {
  const validFonts = [${fontFamilyKeys.map(key => `'${key}'`).join(', ')}];
  return validFonts.includes(value);
};

export const isValidCrediscoreRadius = (value: string): value is CrediscoreRadius => {
  const validRadius = [${radiusKeys.map(key => `'${key}'`).join(', ')}];
  return validRadius.includes(value);
};

// Utilidades para acceso seguro a tokens
export interface CrediscoreTokens {
  colors: Record<CrediscoreColor, string>;
  spacing: Record<CrediscoreSpacing, string | number>;
  fontFamily: Record<CrediscoreFontFamily, string>;
  radius: Record<CrediscoreRadius, string | number>;
}

// Exportar tokens con tipado estricto
export const crediscoreTokens: CrediscoreTokens = {
  colors: ${JSON.stringify(colorTokens, null, 2)},
  spacing: ${JSON.stringify(spacingTokens, null, 2)},
  fontFamily: ${JSON.stringify(fontFamilyTokens, null, 2)},
  radius: ${JSON.stringify(radiusTokens, null, 2)}
};

// Helper para obtener valor de token con type safety
export const getToken = <T extends keyof CrediscoreTokens>(
  category: T,
  key: keyof CrediscoreTokens[T]
): CrediscoreTokens[T][keyof CrediscoreTokens[T]] => {
  return crediscoreTokens[category][key];
};

// Helper específico para colores (uso más común)
export const getColor = (color: CrediscoreColor): string => {
  return crediscoreTokens.colors[color];
};

// Helper específico para espaciado
export const getSpacing = (spacing: CrediscoreSpacing): string | number => {
  return crediscoreTokens.spacing[spacing];
};

// Helper específico para fonts
export const getFontFamily = (font: CrediscoreFontFamily): string => {
  return crediscoreTokens.fontFamily[font];
};

// Helper específico para radius
export const getRadius = (radius: CrediscoreRadius): string | number => {
  return crediscoreTokens.radius[radius];
};
  `;
};

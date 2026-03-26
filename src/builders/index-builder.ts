import { CONFIG } from '../../../../tests/constants';
import type { TokenCollection } from '../types';

export function buildIndex(tokens: TokenCollection): string {
  return `${CONFIG.warningHeader}
/**
 * Crediscore Design Tokens - Main Export
 * 
 * This file serves as the main entry point for all design token configurations.
 * Import specific framework configurations from their respective directories.
 */

// CSS Variables
export * from './css/theme.css';

// Framework Configurations
export * from './tailwind/tailwind.config';
export * from './mantine/mantine.config';
export * from './tamagui/tamagui.config';

// TypeScript Types
export * from './types/mantine';
export * from './types/generated/enterprise-types';

// Token Collection for programmatic access
export const tokens = ${JSON.stringify(tokens, null, 2)} as const;

/**
 * Design Token Categories
 */
export const colors = {
  primary: tokens.color?.primary || {},
  secondary: tokens.color?.secondary || {},
  neutral: tokens.color?.neutral || {},
  semantic: tokens.color?.semantic || {},
};

export const typography = {
  fontFamily: tokens.typography?.fontFamily || {},
  fontSize: tokens.typography?.fontSize || {},
  fontWeight: tokens.typography?.fontWeight || {},
  lineHeight: tokens.typography?.lineHeight || {},
};

export const spacing = {
  scale: tokens.spacing?.scale || {},
  semantic: tokens.spacing?.semantic || {},
};

export const shadows = {
  elevation: tokens.shadows?.elevation || {},
  semantic: tokens.shadows?.semantic || {},
};

export const borders = {
  radius: tokens.borders?.radius || {},
  width: tokens.borders?.width || {},
};

/**
 * Framework-specific exports
 */
export { default as tailwindConfig } from './tailwind/tailwind.config';
export { default as mantineConfig } from './mantine/mantine.config';
export { default as tamaguiConfig } from './tamagui/tamagui.config';

/**
 * Utility functions for token access
 */
export function getToken(category: string, key: string): any {
  return (tokens as any)[category]?.[key];
}

export function getColor(name: string): any {
  return getToken('color', name);
}

export function getFontSize(size: string): any {
  return getToken('fontSize', size);
}

export function getSpacing(size: string): any {
  return getToken('spacing', size);
}
`;
}

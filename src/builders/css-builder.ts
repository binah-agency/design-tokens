import type { TokenCollection } from '../types';
import { toKebabCase, hexToRgbChannels } from '../utils/helpers';
import { CONFIG } from '../../../../tests/constants';

export const buildCSS = (globals: TokenCollection, themes: any): string => {
  const formatCSSValue = (val: any): string => {
    if (typeof val !== 'string') return val;
    return val.replace(/\{([^}]+)\}/g, (match, path) => {
      const cleanPath = path.replace(/^theme\./, '').replace(/^light\./, '').replace(/^dark\./, '');
      return `var(--${CONFIG.prefix}-${toKebabCase(cleanPath)})`;
    });
  };

  const figmaSpecificVars = `
    /* Figma Design System Variables */
    --credi-color-primary-azul-horizonte: ${CONFIG.figmaColorMappings['credi/color/primary/azul-horizonte']};
    --credi-color-primary-azul-horizonte-dark: ${CONFIG.figmaColorMappings['credi/color/primary/azul-horizonte-dark']};
    --credi-color-accent-verde-vitalidad: ${CONFIG.figmaColorMappings['credi/color/accent/verde-vitalidad']};
    --credi-color-neutral-white: ${CONFIG.figmaColorMappings['credi/color/neutral/white']};
    --credi-color-neutral-black: ${CONFIG.figmaColorMappings['credi/color/neutral/black']};
    
    /* Font Family - Montserrat (Figma Standard) */
    --fontfamily-montserrat: 'Montserrat', Arial, sans-serif;
  `;

  let css = CONFIG.warningHeader + `@layer ${CONFIG.prefix}-tokens {\n`;
  css += `  :root, [data-theme="light"] {\n    color-scheme: light;\n`;
  css += figmaSpecificVars;
  css += `\n`;
  
  // Global tokens
  if (globals.colors) {
    css += `  /* Colors */\n`;
    for (const [key, value] of Object.entries(globals.colors)) {
      css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
      if (typeof value === 'string' && value.startsWith('#')) {
        css += `    --${CONFIG.prefix}-${toKebabCase(key)}-rgb: ${hexToRgbChannels(value)};\n`;
      }
    }
  }
  
  if (globals.spacing) {
    css += `  /* Spacing */\n`;
    for (const [key, value] of Object.entries(globals.spacing)) {
      css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
    }
  }
  
  if (globals.typography) {
    css += `  /* Typography */\n`;
    if (globals.typography.fontFamily) {
      css += `  /* Font Family */\n`;
      for (const [key, value] of Object.entries(globals.typography.fontFamily)) {
        css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
      }
    }
    
    if (globals.typography.fontSize) {
      css += `  /* Font Size */\n`;
      for (const [key, value] of Object.entries(globals.typography.fontSize)) {
        css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
      }
    }
  }
  
  // Light theme
  if (themes.light) {
    css += `  /* Light Theme */\n`;
    for (const [key, value] of Object.entries(themes.light)) {
      css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
      if (typeof value === 'string' && value.startsWith('#')) {
        css += `    --${CONFIG.prefix}-${toKebabCase(key)}-rgb: ${hexToRgbChannels(value)};\n`;
      }
    }
  }
  
  // Dark theme
  if (themes.dark) {
    css += `  /* Dark Theme */\n`;
    for (const [key, value] of Object.entries(themes.dark)) {
      css += `    --${CONFIG.prefix}-${toKebabCase(key)}: ${formatCSSValue(value)};\n`;
      if (typeof value === 'string' && value.startsWith('#')) {
        css += `    --${CONFIG.prefix}-${toKebabCase(key)}-rgb: ${hexToRgbChannels(value)};\n`;
      }
    }
  }
  
  css += `}\n\n`;
  
  return css;
};

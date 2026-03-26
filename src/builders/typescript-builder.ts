import type { TokenCollection } from '../types';
import { CONFIG } from '../../../../tests/constants';

export const buildTypeScript = (globals: TokenCollection, themes: any): string => {
  return CONFIG.warningHeader + `export interface TokenGlobals {\n` +
    `  colors?: Record<string, string>;\n` +
    `  space?: Record<string, string | number>;\n` +
    `  typography?: {\n` +
    `    fontFamily?: Record<string, string>;\n` +
    `    fontSize?: Record<string, string | number>;\n` +
    `  };\n` +
    `}\n\n` +
    `export interface TokenThemes {\n` +
    `  light?: Partial<TokenGlobals>;\n` +
    `  dark?: Partial<TokenGlobals>;\n` +
    `}\n\n` +
    `export const tokens: TokenGlobals = ${JSON.stringify(globals, null, 2)};\n` +
    `export const themes: TokenThemes = ${JSON.stringify(themes, null, 2)};\n`;
};

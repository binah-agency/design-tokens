// Main exports for @crediscore/tokens package
export * from './types';
export * from './utils';
export * from './builders';
export * from './core/build';
export * from './cli';

// Export default for design tokens
import tokens from '../theme.tokens.json' with { type: 'json' };
export default tokens.global;

// Re-export commonly used utilities
export { build } from './core/build';
export { buildCSS, buildTailwind, buildMantine, buildTamagui, buildTypeScript } from './builders';
export { Logger } from './utils/logger';
export { convertW3CToTokenCollection, resolveTree, cleanRawTokens } from './utils/token-resolution';

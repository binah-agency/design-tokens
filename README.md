# @crediscore/tokens

Modular design tokens compilation system with multi-framework support for the Crediscore Design System.

## Overview

This package provides a powerful design token management system that compiles design tokens into multiple framework-specific outputs including CSS variables, Tailwind config, Mantine config, Tamagui config, and TypeScript types.

## Features

- 🎨 **Multi-framework support** - CSS, Tailwind, Mantine, Tamagui
- 📦 **Modular architecture** - Organized token structure
- 🔧 **CLI tool** - Command-line interface for token operations
- 📝 **TypeScript support** - Full type safety
- 🔄 **Watch mode** - Automatic rebuild on token changes
- ✅ **Validation** - Token schema validation

## Installation

```bash
pnpm add @crediscore/tokens
```

## CLI Usage

### Build Tokens

```bash
# Build all token outputs
design-tokens build

# Or via pnpm
pnpm tokens:build
```

### Watch Mode

```bash
# Watch for changes and rebuild automatically
design-tokens watch

# Or via pnpm
pnpm tokens:watch
```

### Validate Tokens

```bash
# Validate token schema
design-tokens validate

# Or via pnpm
pnpm --filter @crediscore/tokens validate
```

### Clean Build

```bash
# Clean generated files
design-tokens clean

# Or via pnpm
pnpm --filter @crediscore/tokens clean
```

## Token Structure

Tokens are defined in `theme.tokens.json` following W3C Design Token specification:

```json
{
  "global": {
    "color": {
      "primary": {
        "value": "#3467B0",
        "type": "color"
      }
    },
    "space": {
      "sm": {
        "value": "8px",
        "type": "dimension"
      }
    },
    "typography": {
      "fontFamily": {
        "primary": {
          "value": ["Inter", "sans-serif"],
          "type": "fontFamily"
        }
      }
    }
  }
}
```

## Generated Outputs

### CSS Variables
- Location: `packages/config/css/theme.css`
- Usage: CSS custom properties for web applications

### Tailwind Config
- Location: `packages/config/tailwind/tailwind.config.ts`
- Usage: Tailwind CSS configuration with design tokens

### Mantine Config
- Location: `packages/config/mantine/mantine.config.ts`
- Usage: Mantine UI theme configuration

### Tamagui Config
- Location: `packages/config/tamagui/tamagui.config.ts`
- Usage: Tamagui configuration for React Native

### TypeScript Types
- Location: `packages/config/types/mantine.d.ts`
- Usage: Type definitions for all tokens

## API

### Programmatic Usage

```typescript
import { TokenBuilder } from '@crediscore/tokens/builders';
import { TokenValidator } from '@crediscore/tokens';
import type { TokenSchema } from '@crediscore/tokens/types';

// Build tokens programmatically
const builder = new TokenBuilder();
await builder.build('theme.tokens.json');

// Validate tokens
const validator = new TokenValidator();
const result = await validator.validate('theme.tokens.json');
```

### Token Resolution

```typescript
import { resolveTree, convertW3CToTokenCollection } from '@crediscore/tokens/utils';

// Resolve token references
const resolved = resolveTree(tokens, scope);

// Convert W3C tokens to internal format
const collection = convertW3CToTokenCollection(schema);
```

## Development

### Scripts

```bash
# Build the package
pnpm run build

# Watch for changes
pnpm run dev

# Type checking
pnpm run type-check

# Clean build
pnpm run clean

# Compile TypeScript
pnpm run compile
```

### Package Structure

```
src/
├── cli/           # CLI tool implementation
├── core/          # Core token processing
├── builders/      # Output builders for each framework
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── index.ts       # Main package exports
```

## Configuration

The token system can be configured through environment variables and CLI options:

```bash
# Set input file path
design-tokens build --input ./custom-tokens.json

# Set output directory
design-tokens build --output ./generated

# Enable verbose logging
design-tokens build --verbose
```

## Integration

### With CSS Projects

```css
/* Import generated CSS variables */
@import '@crediscore/config/css/theme.css';

/* Use tokens in CSS */
.component {
  color: var(--color-primary);
  padding: var(--space-sm);
}
```

### With Tailwind

```javascript
// Import generated Tailwind config
import tailwindConfig from '@crediscore/config/tailwind/tailwind.config.js';

// Use in tailwind.config.js
export default {
  ...tailwindConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### With Mantine

```typescript
// Import generated Mantine theme
import { mantineTheme } from '@crediscore/config/mantine/mantine.config';

// Use in MantineProvider
<MantineProvider theme={mantineTheme}>
  <App />
</MantineProvider>
```

### With Tamagui

```typescript
// Import generated Tamagui config
import tamaguiConfig from '@crediscore/config/tamagui/tamagui.config';

// Use in TamaguiProvider
<TamaguiProvider config={tamaguiConfig}>
  <App />
</TamaguiProvider>
```

## Contributing

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Make changes
4. Run tests: `pnpm test`
5. Build: `pnpm run build`

## License

MIT © Crediscore Team

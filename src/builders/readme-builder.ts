import { CONFIG } from '../../../../tests/constants';
import type { TokenCollection } from '../types';

export function buildReadme(tokens: TokenCollection): string {
  const buildDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# Crediscore Design Tokens

> Generated on ${buildDate} from \`theme.tokens.json\`

This package contains all the design tokens and framework configurations for the Crediscore Design System.

## 📁 Structure

\`\`\`
packages/config/
├── css/
│   └── theme.css              # CSS Custom Properties
├── tailwind/
│   └── tailwind.config.ts     # Tailwind CSS configuration
├── mantine/
│   ├── mantine.config.ts       # Mantine theme configuration
│   └── postcss.config.js      # PostCSS configuration for Mantine
├── tamagui/
│   └── tamagui.config.ts      # Tamagui configuration
├── types/
│   ├── mantine.d.ts           # TypeScript definitions for Mantine
│   └── generated/
│       └── enterprise-types.ts # Enterprise type definitions
├── index.ts                  # Main export file
└── README.md                 # This file
\`\`\`

## 🚀 Usage

### Import Everything

\`\`\`typescript
import { tokens, colors, typography, spacing } from '@crediscore/config';
\`\`\`

### Framework-Specific Imports

\`\`\`typescript
// Tailwind CSS
import tailwindConfig from '@crediscore/config/tailwind/tailwind.config';

// Mantine
import mantineConfig from '@crediscore/config/mantine/mantine.config';

// Tamagui
import tamaguiConfig from '@crediscore/config/tamagui/tamagui.config';

// CSS Variables
import '@crediscore/config/css/theme.css';
\`\`\`

## 🎨 Design Token Categories

### Colors
${tokens.colors ? Object.keys(tokens.colors).map(category => `- **${category}**: ${Object.keys((tokens.colors as any)[category] || {}).join(', ')}`).join('\n') : '- No color tokens defined'}

### Typography
${tokens.typography ? `
- **Font Families**: ${Object.keys(tokens.typography.fontFamily || {}).join(', ')}
- **Font Sizes**: ${Object.keys(tokens.typography.fontSize || {}).join(', ')}
- **Font Weights**: ${Object.keys(tokens.typography.fontWeight || {}).join(', ')}
` : '- No typography tokens defined'}

### Spacing
${tokens.spacing ? `- **Scale**: ${Object.keys(tokens.spacing.scale || {}).join(', ')}` : '- No spacing tokens defined'}

## 🔧 Utility Functions

\`\`\`typescript
import { getToken, getColor, getFontSize, getSpacing } from '@crediscore/config';

// Get any token
const primaryColor = getToken('color', 'primary');

// Get specific token types
const blueColor = getColor('primary.blue');
const headingSize = getFontSize('heading');
const mediumSpacing = getSpacing('md');
\`\`\`

## 🎯 Framework Integration

### Tailwind CSS
The Tailwind config extends the default configuration with:
- Custom colors from the design system
- Spacing scale
- Font families and sizes
- Custom shadows and borders

### Mantine
The Mantine theme includes:
- Color palette for light and dark themes
- Typography settings
- Spacing and layout tokens
- Component-specific theming

### Tamagui
The Tamagui configuration provides:
- Native design tokens
- Responsive breakpoints
- Animation settings
- Component themes

## 🔄 Updates

This package is **automatically generated** from the source design tokens. Do not edit files directly.

To update:
1. Modify \`packages/design-tokens/theme.tokens.json\`
2. Run \`pnpm tokens:build\`
3. Commit the generated files

## 📋 Figma Integration

All tokens are mapped directly from the Figma Design System:
- **Primary Blue Azul Horizonte**: \`${CONFIG.figmaColorMappings['credi/color/primary/azul-horizonte']}\`
- **Primary Blue Azul Horizonte (Dark)**: \`${CONFIG.figmaColorMappings['credi/color/primary/azul-horizonte-dark']}\`
- **Accent Verde Vitalidad**: \`${CONFIG.figmaColorMappings['credi/color/accent/verde-vitalidad']}\`
- **Neutral White**: \`${CONFIG.figmaColorMappings['credi/color/neutral/white']}\`
- **Neutral Black**: \`${CONFIG.figmaColorMappings['credi/color/neutral/black']}\`

## 🚨 Important

⚠️ **DO NOT EDIT DIRECTLY** - All files in this package are generated automatically. Any manual changes will be overwritten during the next build.

## 📚 Additional Resources

- [Design Tokens Documentation](../../docs/getting-started/design-system/)
- [Figma Design System](https://figma.com/crediscore-design-system)
- [Component Library](../../packages/ui/)

---

Generated with ❤️ by Crediscore Design Token Pipeline
`;
}

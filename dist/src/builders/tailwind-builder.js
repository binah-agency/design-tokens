import { CONFIG } from '../config/constants';
export const buildTailwind = (globals, themes) => {
    const extend = {};
    // Colors - map to Tailwind format
    if (globals.colors) {
        extend.colors = {};
        for (const [key, value] of Object.entries(globals.colors)) {
            if (typeof value === 'string' && value.startsWith('#')) {
                // Create Tailwind color palette with shades
                extend.colors[key] = {
                    50: value,
                    100: value,
                    200: value,
                    300: value,
                    400: value,
                    500: value,
                    600: value,
                    700: value,
                    800: value,
                    900: value,
                    DEFAULT: value
                };
            }
        }
    }
    // Spacing - ensure proper rem/px conversion
    if (globals.spacing) {
        extend.spacing = {};
        for (const [key, value] of Object.entries(globals.spacing)) {
            const valueStr = value.toString();
            if (valueStr.includes('rem')) {
                extend.spacing[key] = valueStr;
            }
            else if (typeof value === 'number') {
                extend.spacing[key] = `${value / 16}rem`; // Convert px to rem
            }
            else {
                extend.spacing[key] = valueStr;
            }
        }
    }
    // Typography
    if (globals.typography) {
        extend.fontFamily = globals.typography.fontFamily || {};
        extend.fontSize = globals.typography.fontSize || {};
        extend.lineHeight = globals.typography.lineHeight || {};
        // Add letterSpacing if it exists in typography
        const typographyAny = globals.typography;
        if (typographyAny.letterSpacing) {
            extend.letterSpacing = typographyAny.letterSpacing;
        }
    }
    // Border radius
    if (globals.radius) {
        extend.borderRadius = globals.radius;
    }
    return `${CONFIG.warningHeader}import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: { 
    extend: ${JSON.stringify(extend, null, 2)},
    colors: {
      ...${JSON.stringify(extend.colors || {}, null, 2)},
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent'
    }
  },
  plugins: []
};

export default config;`;
};
//# sourceMappingURL=tailwind-builder.js.map
// Real validation tests using actual validation utilities
import { validateTokenStructure } from '../../utils/validation';
import type { TokenSchema } from '../../types';

describe('Real Token Validation Tests', () => {
  test('should validate complete Crediscore token structure', () => {
    const validTokens: TokenSchema = {
      global: {
        color: {
          azulHorizonte: '#3467B0',
          azulHorizonteAlt: '#6BB6FF',
          azulHorizonteDark: '#3468A0',
          azulHorizonteLight: '#6BB6FF',
          verdeVitalidad: '#86BD45',
          verdeVitalidadHover: '#9BC85D',
          rojoAlerta: '#D32F2F',
          rojoErrorClaro: '#F2555A',
          naranjaAdvertencia: '#F57C00',
          amarilloAdvertenciaClaro: '#FFEF5C',
          azulInfo: '#1976D2',
          grisTexto: '#707070',
          white: '#FFFFFF',
          black: '#000000'
        },
        space: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        typography: {
          fontFamily: {
            montserrat: 'Montserrat, sans-serif'
          },
          fontSize: {
            body1: 12,
            body2: 14,
            body3: 16,
            body4: 19,
            heading1: 20,
            heading2: 24,
            heading3: 32,
            heading4: 48
          },
          fontWeight: {
            regular: 400,
            bold: 700,
            black: 900
          },
          lineHeight: {
            body1: 18,
            body2: 21,
            body3: 24,
            body4: 29
          }
        },
        radius: {
          0: 0,
          1: 4,
          2: 8,
          3: 12,
          4: 16,
          5: 24,
          6: 32,
          round: 9999
        },
        opacity: {
          0: 0,
          25: 0.25,
          50: 0.5,
          75: 0.75,
          100: 1
        },
        zIndex: {
          0: 0,
          1: 1,
          10: 10,
          20: 20,
          30: 30,
          40: 40,
          50: 50
        },
        borderWidth: {
          0: 0,
          1: 1,
          2: 2,
          4: 4
        },
        size: {
          0: 0,
          1: 4,
          2: 8,
          3: 12,
          4: 16,
          5: 20,
          6: 24,
          7: 28,
          8: 32,
          9: 36,
          10: 40,
          11: 44,
          12: 48,
          14: 56,
          16: 64,
          20: 80,
          24: 96
        },
        motion: {
          duration: {
            fast: '150ms',
            normal: '200ms',
            slow: '300ms'
          },
          easing: {
            ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
            easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)'
          }
        },
        screens: {
          xs: '320px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px'
        }
      },
      light: {
        background: '#FFFFFF',
        foreground: '#000000',
        muted: '#707070',
        accent: '#3467B0',
        border: '#E5E7EB',
        input: '#FFFFFF',
        ring: '#3467B0'
      },
      dark: {
        background: '#000000',
        foreground: '#FFFFFF',
        muted: '#A1A1AA',
        accent: '#3467B0',
        border: '#1F2937',
        input: '#1F2937',
        ring: '#3467B0'
      },
      $themes: [
        {
          id: 'light_theme',
          name: 'Light Mode',
          selectedTokenSets: {
            global: 'enabled',
            light: 'enabled'
          },
          $figmaStyleReferences: {}
        },
        {
          id: 'dark_theme',
          name: 'Dark Mode',
          selectedTokenSets: {
            global: 'enabled',
            dark: 'enabled'
          },
          $figmaStyleReferences: {}
        }
      ],
      $metadata: {
        tokenSetOrder: [
          'global',
          'light',
          'dark'
        ]
      }
    };

    const result = validateTokenStructure(validTokens);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  test('should detect missing required Figma colors', () => {
    const incompleteTokens: Partial<TokenSchema> = {
      global: {
        color: {
          azulHorizonte: '#3467B0'
          // Missing other required Figma colors
        },
        space: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24
        },
        typography: {
          fontFamily: {
            montserrat: 'Montserrat, sans-serif'
          },
          fontSize: {
            body1: 12,
            body2: 14,
            body3: 16
          },
          fontWeight: {
            regular: 400,
            bold: 700
          },
          lineHeight: {
            body1: 18,
            body2: 21,
            body3: 24
          }
        }
      }
    };

    const result = validateTokenStructure(incompleteTokens);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('Missing required Figma color'))).toBe(true);
  });

  test('should detect invalid spacing values', () => {
    const invalidTokens: Partial<TokenSchema> = {
      global: {
        color: {
          azulHorizonte: '#3467B0',
          azulHorizonteAlt: '#6BB6FF',
          azulHorizonteDark: '#3468A0',
          azulHorizonteLight: '#6BB6FF',
          verdeVitalidad: '#86BD45',
          verdeVitalidadHover: '#9BC85D'
        },
        space: {
          xs: 4,
          sm: 8,
          md: 16
          // Missing lg: 24 for Figma consistency
        },
        typography: {
          fontFamily: {
            montserrat: 'Montserrat, sans-serif'
          }
        }
      }
    };

    const result = validateTokenStructure(invalidTokens);
    
    expect(result.valid).toBe(true); // Still valid since required tokens exist
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some(w => w.includes('Space tokens should include 4px, 8px, and 16px for Figma consistency'))).toBe(true);
  });

  test('should detect missing Montserrat font family', () => {
    const invalidTokens: Partial<TokenSchema> = {
      global: {
        color: {
          azulHorizonte: '#3467B0',
          azulHorizonteAlt: '#6BB6FF',
          azulHorizonteDark: '#3468A0',
          azulHorizonteLight: '#6BB6FF',
          verdeVitalidad: '#86BD45',
          verdeVitalidadHover: '#9BC85D'
        },
        space: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24
        },
        typography: {
          fontFamily: {
            // Missing Montserrat
            roboto: 'Roboto, sans-serif'
          },
          fontSize: {
            body1: 12,
            body2: 14,
            body3: 16
          }
        }
      }
    };

    const result = validateTokenStructure(invalidTokens);
    
    expect(result.valid).toBe(true); // Still valid since required tokens exist
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some(w => w.includes('Montserrat font family not found'))).toBe(true);
  });

  test('should validate theme structure', () => {
    const tokensWithThemes: TokenSchema = {
      global: {
        color: {
          azulHorizonte: '#3467B0',
          verdeVitalidad: '#86BD45',
          rojoAlerta: '#D32F2F',
          white: '#FFFFFF',
          black: '#000000'
        },
        space: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24
        }
      },
      light: {
        background: '#FFFFFF',
        foreground: '#000000',
        accent: '#3467B0'
      },
      dark: {
        background: '#000000',
        foreground: '#FFFFFF',
        accent: '#3467B0'
      },
      $themes: [
        {
          id: 'light_theme',
          name: 'Light Mode',
          selectedTokenSets: {
            global: 'enabled',
            light: 'enabled'
          }
        },
        {
          id: 'dark_theme',
          name: 'Dark Mode',
          selectedTokenSets: {
            global: 'enabled',
            dark: 'enabled'
          }
        }
      ],
      $metadata: {
        tokenSetOrder: ['global', 'light', 'dark']
      }
    };

    const result = validateTokenStructure(tokensWithThemes);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('should detect invalid global structure', () => {
    const invalidTokens = {
      // Missing global object
      light: {
        background: '#FFFFFF'
      },
      dark: {
        background: '#000000'
      }
    };

    const result = validateTokenStructure(invalidTokens);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should handle partial token structures gracefully', () => {
    const partialTokens: Partial<TokenSchema> = {
      global: {
        color: {
          azulHorizonte: '#3467B0'
        }
        // Missing other required sections
      }
    };

    const result = validateTokenStructure(partialTokens);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

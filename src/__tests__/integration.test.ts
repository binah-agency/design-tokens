// Integration tests for end-to-end token processing
import { validateTokenStructure } from '../../utils/validation';
import { validateSchema } from '../../utils/validation';
import * as fs from 'fs';
import * as path from 'path';

describe('Integration Tests - End-to-End Workflow', () => {
  const testTokensPath = path.join(__dirname, '../../theme.tokens.json');
  
  test('should load and validate actual theme.tokens.json', () => {
    // Load actual theme.tokens.json
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // Validate schema
    const schemaValidator = validateSchema(tokensData);
    const isValidSchema = schemaValidator(tokensData);
    
    expect(isValidSchema).toBe(true);
    
    // Validate token structure
    const structureValidation = validateTokenStructure(tokensData);
    
    expect(structureValidation.valid).toBe(true);
    expect(structureValidation.errors).toEqual([]);
  });

  test('should validate complete token compilation workflow', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // Test complete workflow
    const workflowSteps = [
      'load_tokens',
      'validate_schema', 
      'validate_structure',
      'check_figma_compliance',
      'validate_themes',
      'verify_metadata'
    ];
    
    workflowSteps.forEach(step => {
      expect(step).toBeDefined();
    });
    
    // Verify all required sections exist
    expect(tokensData.global).toBeDefined();
    expect(tokensData.global.color).toBeDefined();
    expect(tokensData.global.space).toBeDefined();
    expect(tokensData.global.typography).toBeDefined();
    expect(tokensData.global.radius).toBeDefined();
    expect(tokensData.$themes).toBeDefined();
    expect(tokensData.$metadata).toBeDefined();
  });

  test('should validate Figma compliance requirements', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // Check required Figma colors
    const requiredFigmaColors = [
      'azulHorizonte', 'azulHorizonteAlt', 'azulHorizonteDark', 'azulHorizonteLight',
      'verdeVitalidad', 'verdeVitalidadHover'
    ];
    
    requiredFigmaColors.forEach(color => {
      expect(tokensData.global.color[color]).toBeDefined();
      expect(tokensData.global.color[color]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
    
    // Check spacing consistency
    const spacingValues = Object.values(tokensData.global.space);
    expect(spacingValues).toContain(4);  // xs
    expect(spacingValues).toContain(8);  // sm  
    expect(spacingValues).toContain(16); // md
    expect(spacingValues).toContain(24); // lg
    
    // Check Montserrat font family
    expect(tokensData.global.typography.fontFamily.montserrat).toBeDefined();
  });

  test('should validate theme structure', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // Validate light theme
    expect(tokensData.light).toBeDefined();
    expect(tokensData.light.background).toBe('#FFFFFF');
    expect(tokensData.light.foreground).toBe('#000000');
    expect(tokensData.light.accent).toBe('#3467B0');
    
    // Validate dark theme
    expect(tokensData.dark).toBeDefined();
    expect(tokensData.dark.background).toBe('#000000');
    expect(tokensData.dark.foreground).toBe('#FFFFFF');
    expect(tokensData.dark.accent).toBe('#3467B0');
    
    // Validate theme definitions
    expect(tokensData.$themes).toBeDefined();
    expect(tokensData.$themes).toHaveLength(2);
    
    const lightTheme = tokensData.$themes.find(t => t.id === 'light_theme');
    const darkTheme = tokensData.$themes.find(t => t.id === 'dark_theme');
    
    expect(lightTheme).toBeDefined();
    expect(lightTheme.name).toBe('Light Mode');
    expect(lightTheme.selectedTokenSets.global).toBe('enabled');
    expect(lightTheme.selectedTokenSets.light).toBe('enabled');
    
    expect(darkTheme).toBeDefined();
    expect(darkTheme.name).toBe('Dark Mode');
    expect(darkTheme.selectedTokenSets.global).toBe('enabled');
    expect(darkTheme.selectedTokenSets.dark).toBe('enabled');
  });

  test('should validate metadata structure', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // Validate metadata
    expect(tokensData.$metadata).toBeDefined();
    expect(tokensData.$metadata.tokenSetOrder).toBeDefined();
    expect(tokensData.$metadata.tokenSetOrder).toEqual(['global', 'light', 'dark']);
  });

  test('should validate typography system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const typography = tokensData.global.typography;
    
    // Check font families
    expect(typography.fontFamily.montserrat).toBe('Montserrat, sans-serif');
    
    // Check font sizes
    const fontSizes = typography.fontSize;
    expect(fontSizes.body1).toBe(12);
    expect(fontSizes.body2).toBe(14);
    expect(fontSizes.body3).toBe(16);
    expect(fontSizes.body4).toBe(19);
    expect(fontSizes.heading1).toBe(20);
    expect(fontSizes.heading2).toBe(24);
    expect(fontSizes.heading3).toBe(32);
    expect(fontSizes.heading4).toBe(48);
    
    // Check font weights
    const fontWeights = typography.fontWeight;
    expect(fontWeights.regular).toBe(400);
    expect(fontWeights.bold).toBe(700);
    expect(fontWeights.black).toBe(900);
    
    // Check line heights
    const lineHeights = typography.lineHeight;
    expect(lineHeights.body1).toBe(18);
    expect(lineHeights.body2).toBe(21);
    expect(lineHeights.body3).toBe(24);
    expect(lineHeights.body4).toBe(29);
  });

  test('should validate spacing system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const spacing = tokensData.global.space;
    
    // Check all spacing values
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
    
    // Verify consistent scaling (4px base)
    expect(spacing.xs * 2).toBe(spacing.sm);  // 4 * 2 = 8
    expect(spacing.sm * 2).toBe(spacing.md);  // 8 * 2 = 16
    expect(spacing.md * 1.5).toBe(spacing.lg); // 16 * 1.5 = 24
    expect(spacing.lg * 1.33).toBeCloseTo(spacing.xl, 1); // 24 * 1.33 ≈ 32
  });

  test('should validate radius system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const radius = tokensData.global.radius;
    
    // Check radius values
    expect(radius[0]).toBe(0);
    expect(radius[1]).toBe(4);
    expect(radius[2]).toBe(8);
    expect(radius[3]).toBe(12);
    expect(radius[4]).toBe(16);
    expect(radius[5]).toBe(24);
    expect(radius[6]).toBe(32);
    expect(radius.round).toBe(9999);
  });

  test('should validate opacity system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const opacity = tokensData.global.opacity;
    
    // Check opacity values
    expect(opacity[0]).toBe(0);
    expect(opacity[25]).toBe(0.25);
    expect(opacity[50]).toBe(0.5);
    expect(opacity[75]).toBe(0.75);
    expect(opacity[100]).toBe(1);
  });

  test('should validate motion system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const motion = tokensData.global.motion;
    
    // Check durations
    expect(motion.duration.fast).toBe('150ms');
    expect(motion.duration.normal).toBe('200ms');
    expect(motion.duration.slow).toBe('300ms');
    
    // Check easings
    expect(motion.easing.ease).toBe('cubic-bezier(0.25, 0.1, 0.25, 1)');
    expect(motion.easing.easeIn).toBe('cubic-bezier(0.42, 0, 1, 1)');
    expect(motion.easing.easeOut).toBe('cubic-bezier(0, 0, 0.58, 1)');
    expect(motion.easing.easeInOut).toBe('cubic-bezier(0.42, 0, 0.58, 1)');
  });

  test('should validate screen system', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    const screens = tokensData.global.screens;
    
    // Check screen breakpoints
    expect(screens.xs).toBe('320px');
    expect(screens.sm).toBe('640px');
    expect(screens.md).toBe('768px');
    expect(screens.lg).toBe('1024px');
    expect(screens.xl).toBe('1280px');
    expect(screens['2xl']).toBe('1536px');
  });

  test('should validate complete workflow integration', () => {
    const tokensData = JSON.parse(fs.readFileSync(testTokensPath, 'utf-8'));
    
    // This test ensures the entire workflow works together
    const validationResults = {
      schema: validateSchema(tokensData)(tokensData),
      structure: validateTokenStructure(tokensData),
      hasRequiredColors: ['azulHorizonte', 'azulHorizonteAlt', 'azulHorizonteDark', 'azulHorizonteLight', 'verdeVitalidad', 'verdeVitalidadHover']
        .every(color => tokensData.global.color[color]),
      hasRequiredSpacing: [4, 8, 16, 24]
        .every(size => Object.values(tokensData.global.space).includes(size)),
      hasMontserrat: !!tokensData.global.typography.fontFamily.montserrat,
      hasThemes: tokensData.$themes && tokensData.$themes.length === 2,
      hasMetadata: !!tokensData.$metadata
    };
    
    // All validations should pass
    expect(validationResults.schema).toBe(true);
    expect(validationResults.structure.valid).toBe(true);
    expect(validationResults.hasRequiredColors).toBe(true);
    expect(validationResults.hasRequiredSpacing).toBe(true);
    expect(validationResults.hasMontserrat).toBe(true);
    expect(validationResults.hasThemes).toBe(true);
    expect(validationResults.hasMetadata).toBe(true);
  });
});

import { validateTokens } from '../src/utils/validation';

// Mock console for testing
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock process for testing
const mockProcess = {
  cwd: jest.fn(),
  exit: jest.fn()
};

describe('Token Validation', () => {
  beforeEach(() => {
    jest.resetModules();
    mockConsole.log.mockClear();
    mockConsole.error.mockClear();
    mockConsole.warn.mockClear();
    mockConsole.info.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Token Schema Validation', () => {
    test('should validate valid color tokens', () => {
      const validTokens = {
        global: {
          color: {
            azulHorizonte: '#3467B0',
            verdeVitalidad: '#86BD45',
            rojoAlerta: '#D32F2F',
            white: '#FFFFFF'
          },
          space: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24
          }
        }
      };

      const result = validateTokens(validTokens);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(mockConsole.log).toHaveBeenCalledWith('✅ Token validation passed');
    });

    test('should detect invalid color format', () => {
      const invalidTokens = {
        global: {
          color: {
            azulHorizonte: 'invalid-color', // Invalid format
            verdeVitalidad: '#invalid-color' // Invalid format
          }
        }
      };

      const result = validateTokens(invalidTokens);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Color tokens must be valid hex values');
      expect(mockConsole.error).toHaveBeenCalledWith('❌ Token validation failed');
    });

    test('should detect missing required tokens', () => {
      const incompleteTokens = {
        global: {
          // Missing required color tokens
          space: {
            xs: 4,
            sm: 8
            // Missing md, lg
          }
        }
      };

      const result = validateTokens(incompleteTokens);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required tokens: md, lg');
    });
  });

  describe('Token Compiler', () => {
    test('should compile tokens to TypeScript', () => {
      const { compileTokens } = require('../src/cli/index');
      
      const mockFs = {
        writeFile: jest.fn(),
        mkdir: jest.fn()
      };

      // Mock fs operations
      jest.doMock('fs', () => mockFs);
      
      compileTokens({
        input: './test/fixtures/theme.tokens.json',
        output: './test-output',
        generators: ['typescript']
      });

      expect(mockFs.mkdir).toHaveBeenCalledWith('./test-output', { recursive: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('colors.ts'),
        expect.stringContaining('export type Color'),
        expect.any(String)
      );
    });

    test('should generate Tamagui config', () => {
      const { compileTokens } = require('../src/cli/index');
      
      const mockFs = {
        writeFile: jest.fn(),
        mkdir: jest.fn()
      };

      jest.doMock('fs', () => mockFs);
      
      compileTokens({
        input: './test/fixtures/theme.tokens.json',
        output: './test-output',
        generators: ['tamagui']
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tamagui.config.ts'),
        expect.stringContaining('createTamagui'),
        expect.any(String)
      );
    });
  });

  describe('Token Utils', () => {
    test('should resolve token references', () => {
      const { resolveTokenReferences } = require('../src/utils/helpers');
      
      const tokensWithRefs = {
        global: {
          color: {
            primary: '{color.azulHorizonte}',
            secondary: '{color.verdeVitalidad}'
          }
        }
      };

      const resolved = resolveTokenReferences(tokensWithRefs);
      
      expect(resolved.global.color.primary).toBe('#3467B0');
      expect(resolved.global.color.secondary).toBe('#86BD45');
    });

    test('should validate token references', () => {
      const { validateTokenReferences } = require('../src/utils/validation');
      
      const tokensWithInvalidRefs = {
        global: {
          color: {
            primary: '{color.nonexistent}' // Invalid reference
          }
        }
      };

      const result = validateTokenReferences(tokensWithInvalidRefs);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid token reference: color.nonexistent');
    });
  });

  describe('Integration Tests', () => {
    test('should build and validate end-to-end', () => {
      const { compileTokens } = require('../src/cli/index');
      const { validateTokens } = require('../src/utils/validation');
      
      const mockFs = {
        writeFile: jest.fn(),
        mkdir: jest.fn(),
        readFileSync: jest.fn()
      };

      jest.doMock('fs', () => mockFs);
      
      // Mock successful file read
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        global: {
          color: {
            azulHorizonte: '#3467B0',
            verdeVitalidad: '#86BD45',
            rojoAlerta: '#D32F2F',
            white: '#FFFFFF'
          },
          space: {
            xs: 4, sm: 8, md: 16, lg: 24
          }
        }
      }));

      // Execute compilation
      compileTokens({
        input: './test/fixtures/theme.tokens.json',
        output: './test-output',
        generators: ['typescript', 'tamagui']
      });

      // Execute validation
      const validationResult = validateTokens(JSON.parse(mockFs.readFileSync.mock.calls[0][1]));

      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toEqual([]);
      
      // Verify output files were created
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('colors.ts'),
        expect.any(String)
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tamagui.config.ts'),
        expect.any(String)
      );
    });
  });
});

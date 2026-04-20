import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';
import { CONFIG } from '../../../../tests/constants';
import { buildCSS, buildEnterpriseTypes, buildIndex, buildMantine, buildMantineConfig, buildReadme, buildTailwind, buildTamagui, buildTypeScript } from '../builders';
import type { ValidationResult } from '../types';
import { Logger } from '../utils/logger';
import { cleanRawTokens, convertW3CToTokenCollection } from '../utils/token-resolution';
import { validateSchema, validateTokenStructure } from '../utils/validation';

async function build(): Promise<void> {
  const startTime = performance.now();
  Logger.info('Starting token build process...', { function: 'build' });

  try {
    const rawData = fs.readFileSync(CONFIG.inputPath, 'utf8');
    const tokens = cleanRawTokens(JSON.parse(rawData));
    
    const valid = validateSchema(tokens);
    if (!valid(tokens)) {
      Logger.error('Schema validation failed:', { function: 'build' });
      console.error(valid.errors);
      process.exit(1);
    }

    const globals = convertW3CToTokenCollection(tokens);
    const themes = {
      light: tokens.light?.theme || {},
      dark: tokens.dark?.theme || {}
    };
    
    const result: ValidationResult = validateTokenStructure(tokens);
    
    if (!result.valid) {
      Logger.error('Token structure validation failed:', { function: 'build' });
      result.errors.forEach((issue: string) => Logger.error(`  - ${issue}`));
      process.exit(1);
    }
    
    if (result.warnings.length > 0) {
      result.warnings.forEach((warning: string) => Logger.warn(`Warning: ${warning}`));
    }

    // CRITICAL: Resolve tokens before distribution
    const rootScope = { ...globals, ...themes.light };
    const resolvedGlobals = globals;
    const resolvedLight = themes.light;
    const resolvedDark = themes.dark;

    const outputs = [
      { path: CONFIG.outputPaths.css, content: buildCSS(resolvedGlobals, { light: resolvedLight, dark: resolvedDark }), name: 'CSS Variables' },
      { path: CONFIG.outputPaths.tailwind, content: buildTailwind(resolvedGlobals, { light: resolvedLight, dark: resolvedDark }), name: 'Tailwind Config' },
      { path: CONFIG.outputPaths.mantine, content: buildMantine(), name: 'Mantine PostCSS' },
      { path: CONFIG.outputPaths.mantineConfig, content: buildMantineConfig(resolvedGlobals, tokens), name: 'Mantine Config' },
      { path: CONFIG.outputPaths.tamagui, content: buildTamagui(resolvedGlobals, tokens), name: 'Tamagui Config' },
      { path: CONFIG.outputPaths.types, content: buildTypeScript(resolvedGlobals, { light: resolvedLight, dark: resolvedDark }), name: 'TypeScript Types' },
      { path: CONFIG.outputPaths.enterpriseTypes, content: buildEnterpriseTypes(resolvedGlobals), name: 'Enterprise Types' },
      { path: CONFIG.outputPaths.index, content: buildIndex(resolvedGlobals), name: 'Index File' },
      { path: CONFIG.outputPaths.readme, content: buildReadme(resolvedGlobals), name: 'README' }
    ];

    for (const output of outputs) {
      const outputPath = output.path;
      if (!outputPath) {
        console.error(`Output path is undefined for ${output.name}`);
        continue;
      }
      
      // Ensure directory exists before writing
      const dir = path.dirname(outputPath);
      await fs.promises.mkdir(dir, { recursive: true });
      
      console.log(`Generating ${output.name} to ${outputPath}`);
      await writeFile(outputPath, output.content, 'utf8');
      console.log(`${output.name} generated successfully`);
    }

    const endTime = performance.now();
    Logger.success(`Build completed in ${((endTime - startTime) / 1000).toFixed(2)}s`, { function: 'build' });
  } catch (error) {
    Logger.error(`Build failed: ${(error as Error).message}`, { function: 'build' });
    process.exit(1);
  }
}

export { build };

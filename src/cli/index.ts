#!/usr/bin/env node

import { program } from 'commander';
import { CONFIG } from '../../../../tests/constants';
import { build } from '../core/build';
import { Logger } from '../utils/logger';

program
  .name('design-tokens')
  .description('Design token build system for Crediscore')
  .version('1.0.0');

program
  .command('build')
  .description('Build design tokens for all frameworks')
  .action(async () => {
    Logger.info(`Input path: ${CONFIG.inputPath}`);
    try {
      await build();
    } catch (error) {
      Logger.error(`Build failed: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate design token structure')
  .action(async () => {
    // TODO: Implement validation
    Logger.info('Validation coming soon...');
  });

program
  .command('watch')
  .description('Watch for token changes and rebuild')
  .action(async () => {
    // TODO: Implement watch mode
    Logger.info('Watch mode coming soon...');
  });

program
  .command('init')
  .description('Initialize new token project')
  .action(async () => {
    // TODO: Implement initialization
    Logger.info('Project initialization coming soon...');
  });

program.parse();

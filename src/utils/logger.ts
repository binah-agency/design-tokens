import chalk from 'chalk';
import type { LoggerContext } from '../types';

export const Logger = {
  info: (msg: string, context: LoggerContext = {}) => {
    console.log(chalk.cyan('ℹ') + ' ' + chalk.gray('[Tokens]') + ' ' + msg);
    if (context.file) console.log(chalk.cyan('📁') + ' ' + context.file);
    if (context.line) console.log(chalk.cyan('📍') + ' ' + context.line);
    if (context.function) console.log(chalk.cyan('⚙') + ' ' + context.function);
  },
  success: (msg: string, context: LoggerContext = {}) => {
    console.log(chalk.green('✔') + ' ' + chalk.gray('[Tokens]') + ' ' + chalk.green(msg));
    if (context.file) console.log(chalk.green('📁') + ' ' + context.file);
    if (context.line) console.log(chalk.green('📍') + ' ' + context.line);
    if (context.function) console.log(chalk.green('⚙') + ' ' + context.function);
  },
  warn: (msg: string, context: LoggerContext = {}) => {
    console.log(chalk.yellow('⚠') + ' ' + chalk.gray('[Tokens]') + ' ' + chalk.yellow(msg));
    if (context.file) console.log(chalk.yellow('📁') + ' ' + context.file);
    if (context.line) console.log(chalk.yellow('📍') + ' ' + context.line);
    if (context.function) console.log(chalk.yellow('⚙') + ' ' + context.function);
  },
  error: (msg: string, context: LoggerContext = {}) => {
    console.log(chalk.red('✖') + ' ' + chalk.gray('[Tokens]') + ' ' + chalk.red(msg));
    if (context.file) console.log(chalk.red('📁') + ' ' + context.file);
    if (context.line) console.log(chalk.red('📍') + ' ' + context.line);
    if (context.function) console.log(chalk.red('⚙') + ' ' + context.function);
  },
  step: (msg: string) => console.log(`\n${chalk.magenta('♦')} ${chalk.bold(msg)}`)
};

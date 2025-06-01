#!/usr/bin/env node
/**
 * Equorn CLI
 * Command-line interface for the Equorn myth-engine
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { seedCommand } from './commands/seed.js';

const program = new Command();

// Set up CLI metadata
program
  .name('equorn')
  .description('A generative myth-engine to bridge narrative design and playable prototypes')
  .version('0.1.0');

// Seed command
program
  .command('seed')
  .description('Generate a project from a seed file')
  .argument('<seedPath>', 'Path to the seed file (YAML or JSON)')
  .option('-t, --target <target>', 'Target platform (godot, unity, web, docs)', 'web')
  .option('-o, --output <dir>', 'Output directory for generated files')
  .option('-v, --verbose', 'Enable verbose output')
  .action(seedCommand);

// Parse command line arguments
program.parse();

// Initialize command
program
  .command('init')
  .description('Create a new seed file from a template')
  .argument('[name]', 'Name for the new seed (optional)')
  .option('-t, --template <template>', 'Template to use', 'guardian')
  .action((name, options) => {
    console.log(chalk.cyan(`📝 Creating new ${options.template} seed${name ? ` named "${name}"` : ''}...`));
    console.log(chalk.yellow('This feature is not yet implemented.'));
  });

// Run the CLI
program.parse();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

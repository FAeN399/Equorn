#!/usr/bin/env node
/**
 * Equorn CLI
 * Command-line interface for the Equorn myth-engine
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { seedCommand } from './commands/seed.js';
import { emergentCommand } from './commands/emergent.js';

const program = new Command();

// Set up CLI metadata
program
  .name('equorn')
  .description('A generative myth-engine to bridge narrative design and playable prototypes')
  .version('4.4.1');

// Add commands
program.addCommand(seedCommand);
program.addCommand(emergentCommand);

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

// Add help text
program.addHelpText('after', `

${chalk.blue('Examples:')}
  ${chalk.cyan('Generate from seed:')}
    $ pnpm equorn seed ./seeds/forest-guardian.yaml --target godot

  ${chalk.cyan('Emergent narrative generation:')}
    $ pnpm equorn emergent ./seeds/epic-quest.yaml --depth deep --verbose

  ${chalk.cyan('Create new seed:')}
    $ pnpm equorn init my-adventure --template guardian

${chalk.blue('Available Templates:')}
  ${chalk.cyan('guardian')}   - Forest guardian with nature magic
  ${chalk.cyan('ocean')}      - Deep sea exploration and mysteries  
  ${chalk.cyan('tower')}      - Mystical tower with magical challenges
  ${chalk.cyan('quest')}      - Epic multi-stage adventure

${chalk.blue('Target Platforms:')}
  ${chalk.cyan('godot')}      - Godot Engine project files
  ${chalk.cyan('unity')}      - Unity project structure
  ${chalk.cyan('web')}        - Web-based interactive experience
  ${chalk.cyan('docs')}       - Beautiful documentation site

For more help on a specific command:
  $ pnpm equorn <command> --help
`);

// Parse command line arguments
program.parse();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  console.log(chalk.magenta('🌟 Equorn - Generative Myth Engine'));
  console.log(chalk.cyan('═'.repeat(40)));
  program.outputHelp();
}

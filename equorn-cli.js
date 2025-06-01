#!/usr/bin/env node
/**
 * Equorn CLI - Quick Implementation
 * A simple CLI that directly uses your existing buildGuardian implementation
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { program } = require('commander');
// Use chalk v4 which is CJS compatible
const chalk = { 
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`
};

// Import your existing working implementation
const standalone = require('./packages/core/dist/standalone.js');
const { buildGuardian } = standalone;

// Set up CLI metadata
program
  .name('equorn')
  .description('A generative myth-engine to bridge narrative design and playable prototypes')
  .version('4.4.1');

// Seed command
program
  .command('seed')
  .description('Generate a project from a seed file')
  .argument('<seedPath>', 'Path to the seed file (YAML or JSON)')
  .option('-t, --target <target>', 'Target platform (godot, unity, web, docs)', 'godot')
  .option('-o, --output <dir>', 'Output directory for generated files')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (seedFile, options) => {
    try {
      console.log(chalk.cyan('🌟 Equorn Myth-Engine v4.4.1 🌟'));
      console.log(chalk.cyan(`Converting myth seed to ${options.target.charAt(0).toUpperCase() + options.target.slice(1)} project...\n`));
      
      // Resolve the seed file path
      const seedPath = path.resolve(process.cwd(), seedFile);
      
      // Check if seed file exists
      if (!fs.existsSync(seedPath)) {
        throw new Error(`Seed file not found: ${seedPath}`);
      }
      
      // Determine output directory
      let outputDir = options.output || `output/${options.target}`;
      outputDir = path.resolve(process.cwd(), outputDir);
      
      console.log(chalk.green(`🌱 Parsing seed file: ${seedPath}`));
      
      // Measure execution time
      const startTime = Date.now();
      
      // Use the existing buildGuardian function directly
      const result = await buildGuardian({
        seedPath,
        target: options.target,
        outputDir,
        verbose: options.verbose ?? false
      });
      
      const duration = Date.now() - startTime;
      
      // Display success message
      console.log(chalk.green(`\n✨ Generated ${result.files.length} files in ${duration}ms`));
      console.log(chalk.blue(`📁 Output location: ${result.outputPath}\n`));
      
      console.log(chalk.green('✅ Generation complete!'));
      console.log(chalk.blue(`📁 Project location: ${result.outputPath}`));
      console.log(chalk.blue(`📝 Files created: ${result.files.length}\n`));
      
      // List generated files
      if (result.files.length > 0) {
        console.log('Generated files:');
        result.files.forEach(file => {
          console.log(`  - ${file}`);
        });
        console.log();
      }
      
      // Show generation info
      console.log('Generation info:');
      console.log(`  - Target: ${options.target}`);
      console.log(`  - Seed: ${seedPath}`);
      console.log(`  - Time: ${new Date().toLocaleString()}`);
      console.log(`  - Duration: ${duration}ms\n`);
      
      // Show next steps based on target
      if (options.target === 'godot') {
        console.log(chalk.yellow('🎮 Open the project in Godot Engine 4.4.1 to explore!'));
        console.log(chalk.yellow('   Use: "File > Open Project" and select the output/godot folder'));
      } else if (options.target === 'unity') {
        console.log(chalk.yellow('🎮 Open the project in Unity to explore!'));
        console.log(chalk.yellow('   Use: "Open > Add project from disk" and select the output/unity folder'));
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      console.error(chalk.red('Generation failed. Please check your seed file and try again.'));
      process.exit(1);
    }
  });

// Initialize command
program
  .command('init')
  .description('Create a new seed file from a template')
  .argument('[name]', 'Name for the new seed (optional)')
  .option('-t, --template <template>', 'Template to use', 'guardian')
  .action((name, options) => {
    console.log(chalk.cyan(`📝 Creating new ${options.template} seed${name ? ` named "${name}"` : ''}...`));
    
    try {
      // Simple template implementation
      const templatePath = path.join(__dirname, 'seeds', 'forest-guardian.yaml');
      const seedContent = fs.readFileSync(templatePath, 'utf8');
      
      // Create output path
      const outputName = name ? `${name}.yaml` : `${options.template}-${Date.now()}.yaml`;
      const outputPath = path.join(process.cwd(), outputName);
      
      // Write the template
      fs.writeFileSync(outputPath, seedContent);
      
      console.log(chalk.green('✅ Seed file created successfully!'));
      console.log(chalk.blue(`📄 File location: ${outputPath}`));
      console.log();
      console.log('Next steps:');
      console.log(`  1. Edit ${outputName} to customize your world`);
      console.log('  2. Run: equorn seed ' + outputName + ' to generate a project');
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      console.error(chalk.red('Failed to create seed file.'));
      process.exit(1);
    }
  });

// Run the CLI
program.parse();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

import chalk from 'chalk';
import path from 'node:path';
import fs from 'node:fs';
import { generateFromSeed } from '@equorn/core';

interface SeedCommandOptions {
  target: 'godot' | 'unity' | 'web' | 'docs';
  output: string;
  verbose?: boolean;
}

export async function seedCommand(
  seedFile: string,
  options: SeedCommandOptions
): Promise<void> {
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
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(chalk.green(`🌱 Parsing seed file: ${seedPath}`));
    
    // Measure execution time
    const startTime = Date.now();
    
    // Call the core generator function
    const generatedFiles = await generateFromSeed(seedPath, {
      target: options.target,
      outputDir: outputDir,
      verbose: options.verbose ?? false
    });
    
    const duration = Date.now() - startTime;
    
    // Display success message
    console.log(chalk.green(`\n✨ Generated ${generatedFiles.length} files in ${duration}ms`));
    console.log(chalk.blue(`📁 Output location: ${outputDir}\n`));
    
    console.log(chalk.green('✅ Generation complete!'));
    console.log(chalk.blue(`📁 Project location: ${outputDir}`));
    console.log(chalk.blue(`📝 Files created: ${generatedFiles.length}\n`));
    
    // List generated files
    if (generatedFiles.length > 0) {
      console.log('Generated files:');
      generatedFiles.forEach((file: string) => {
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
  } catch (error: unknown) {
    console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
    console.error(chalk.red('Generation failed. Please check your seed file and try again.'));
    process.exit(1);
  }
}

/**
 * Example of using the Equorn buildGuardian API
 * 
 * This example demonstrates how to use the buildGuardian API to generate
 * a complete Godot project from a myth seed file.
 */

// Import the buildGuardian function from @equorn/core
import { buildGuardian } from '../packages/core/dist/index.js';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Get the current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Read version from package.json
const packageJson = JSON.parse(readFileSync(resolve(join(__dirname, '..', 'packages', 'core', 'package.json')), 'utf8'));
const version = packageJson.version;

// Display Equorn version
console.log(`🌟 Equorn Myth-Engine v${version} 🌟`);
console.log('Converting myth seed to Godot project...\n');

// Path to our seed file
const seedPath = resolve(join(__dirname, '..', 'seeds', 'forest-guardian.yaml'));

// Define our generation options
const options = {
  seedPath,
  target: 'godot',
  outputDir: join(__dirname, '..', 'output'),
  verbose: true
};

async function generateProject() {
  try {
    // Call buildGuardian to generate the project
    const result = await buildGuardian(options);
    
    // Output the results
    console.log('\n✅ Generation complete!');
    console.log(`📁 Project location: ${result.outputPath}`);
    console.log(`📝 Files created: ${result.files.length}`);
    
    // List the generated files
    console.log('\nGenerated files:');
    result.files.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Display metadata
    console.log('\nGeneration info:');
    console.log(`  - Target: ${result.metadata.target}`);
    console.log(`  - Seed: ${result.metadata.seedFile}`);
    console.log(`  - Time: ${result.metadata.generatedAt.toLocaleString()}`);
    console.log(`  - Duration: ${result.metadata.duration}ms`);
    
    console.log('\n🎮 Open the project in Godot Engine 4.4.1 to explore!');
    console.log('   Use: "File > Open Project" and select the output/godot folder');
  } catch (error) {
    console.error('❌ Error generating project:', error);
  }
}

// Run the generation
generateProject();

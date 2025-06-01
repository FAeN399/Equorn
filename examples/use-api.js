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

// Official Equorn API Example
// This demonstrates the buildGuardian function as documented in README.md

async function main() {
  console.log("🌟 Equorn API Example - buildGuardian function");
  console.log("=".repeat(50));
  
  try {
    // Example 1: Basic Godot generation
    console.log("\n📍 Example 1: Generate Godot project");
    const godotResult = await buildGuardian({
      seedPath: "./seeds/forest-guardian.yaml",
      target: "godot",
      outputDir: "./output/examples",
      verbose: true,
    });

    console.log(`✅ Godot: Generated ${godotResult.files.length} files`);
    console.log(`📁 Location: ${godotResult.outputPath}`);

    // Example 2: Test different target (Unity - should work once implemented)
    console.log("\n📍 Example 2: Generate Unity project");
    try {
      const unityResult = await buildGuardian({
        seedPath: "./seeds/forest-guardian.yaml",
        target: "unity",
        outputDir: "./output/examples",
        verbose: false,
      });
      console.log(`✅ Unity: Generated ${unityResult.files.length} files`);
    } catch (error) {
      console.log(`⚠️ Unity: ${error.message}`);
    }

    // Example 3: Test web target
    console.log("\n📍 Example 3: Generate Web project");
    try {
      const webResult = await buildGuardian({
        seedPath: "./seeds/forest-guardian.yaml",
        target: "web",
        outputDir: "./output/examples",
        verbose: false,
      });
      console.log(`✅ Web: Generated ${webResult.files.length} files`);
    } catch (error) {
      console.log(`⚠️ Web: ${error.message}`);
    }

    console.log("\n🎉 API example completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Example failed:");
    console.error(error);
    process.exit(1);
  }
}

main();

// Test script to verify buildGuardian works as promised in README section 4.2
import { buildGuardian } from "./packages/core/dist/index.js";

async function testBuildGuardian() {
  console.log("🚀 Testing buildGuardian API...");
  
  try {
    const result = await buildGuardian({
      seedPath: "./seeds/forest-guardian.yaml",
      target: "godot",
      verbose: true,
    });
    
    console.log("✅ Success! Generated files:");
    console.log(`📁 Output location: ${result.outputPath}`);
    console.log(`📝 Files created: ${result.files.length}`);
    console.log(result.files);
    
    console.log("\n📊 Generation metadata:");
    console.log(`  - Target: ${result.metadata.target}`);
    console.log(`  - Seed file: ${result.metadata.seedFile}`);
    console.log(`  - Generated at: ${result.metadata.generatedAt}`);
    console.log(`  - Duration: ${result.metadata.duration}ms`);
    
    return result;
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}

testBuildGuardian().catch(console.error);

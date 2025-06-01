/**
 * Generators module index
 * Re-exports all generators for easier importing
 */

export * from './godot/index.js';
export * from './unity/index.js';
export * from './web/index.js';
export * from './docs/index.js';

import { SeedConfig, GenerationOptions } from '../types.js';
import * as fs from 'fs-extra';
import * as path from 'node:path';
import { parseSeedFile } from '../parser.js';
import { generateGodotProject } from './godot/index.js';
import { generateUnityProject } from './unity/index.js';
import { generateWebProject } from './web/index.js';
import { generateDocsProject } from './docs/index.js';

/**
 * Generate project content from a seed file
 * @param seedPath Path to the YAML or JSON seed file
 * @param options Generation options including target platform and output directory
 */
export async function generateFromSeed(
  seedPath: string,
  options: GenerationOptions
): Promise<void> {
  // Parse the seed file
  const seed = await parseSeedFile(seedPath);
  
  // Ensure output directory exists
  const outputDir = options.outputDir || path.join(process.cwd(), 'output', options.target);
  await fs.ensureDir(outputDir);
  
  if (options.verbose) {
    console.log(`Parsed seed file: ${seedPath}`);
    console.log(`Target: ${options.target}`);
    console.log(`Output directory: ${outputDir}`);
  }
  
  // Generate project based on target
  switch (options.target) {
    case 'godot':
      await generateGodotProject(seed, outputDir, options.verbose);
      break;
    case 'unity':
      await generateUnityProject(seed, outputDir, options.verbose);
      break;
    case 'web':
      await generateWebProject(seed, outputDir, options.verbose);
      break;
    case 'docs':
      await generateDocsProject(seed, outputDir, options.verbose);
      break;
    default:
      throw new Error(`Invalid target: ${options.target}`);
  }
  
  if (options.verbose) {
    console.log(`Project generated successfully in ${outputDir}`);
  }
}

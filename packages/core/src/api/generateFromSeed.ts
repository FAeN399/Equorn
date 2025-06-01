/**
 * generateFromSeed.ts
 * Unified entry point for generating content from seed files
 */

import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { GenerationOptions } from '../types.js';
import * as standalone from '../standalone.js';

/**
 * Generate a project from a seed file
 * @param seedPath Path to the seed file (YAML or JSON)
 * @param options Generation options
 * @returns Array of generated files
 */
export async function generateFromSeed(
  seedPath: string,
  options: GenerationOptions
): Promise<string[]> {
  const { target, outputDir: outputDirOption, verbose = false } = options;
  
  // Ensure we have a valid output directory
  const outputDir = outputDirOption || `./output/${target}`;
  
  // Ensure the output directory exists
  await fs.ensureDir(outputDir);

  if (verbose) {
    console.log(`🌱 Parsing seed file: ${seedPath}`);
  }

  // Load and parse the seed file
  const seedContent = await fs.readFile(seedPath, 'utf8');
  let seedData: any;
  
  // Parse based on file extension
  if (seedPath.endsWith('.yaml') || seedPath.endsWith('.yml')) {
    seedData = yaml.load(seedContent);
  } else if (seedPath.endsWith('.json')) {
    seedData = JSON.parse(seedContent);
  } else {
    throw new Error('Unsupported seed file format. Use .yaml, .yml, or .json');
  }

  // Validate seed data
  if (!seedData || typeof seedData !== 'object') {
    throw new Error('Invalid seed file: must contain a valid object');
  }

  // Generate content based on target
  let generatedFiles: string[] = [];
  
  switch (target) {
    case 'godot':
      if (verbose) {
        console.log(`🎯 Generating godot project...`);
      }
      generatedFiles = await standalone.generateGodotProject(seedData, outputDir, verbose);
      break;
      
    case 'unity':
      if (verbose) {
        console.log(`🎯 Generating unity project...`);
      }
      // TODO: Implement Unity target
      throw new Error('Unity target not yet implemented');
      
    case 'web':
      if (verbose) {
        console.log(`🎯 Generating web project...`);
      }
      // TODO: Implement Web target
      throw new Error('Web target not yet implemented');
      
    case 'docs':
      if (verbose) {
        console.log(`🎯 Generating documentation...`);
      }
      // TODO: Implement Docs target
      throw new Error('Documentation target not yet implemented');
      
    default:
      throw new Error(`Unknown target: ${target}`);
  }

  // Return list of generated files
  return generatedFiles;
}

/**
 * Seed parser for Equorn
 * Handles the loading and validation of myth seed files
 */
import * as fs from 'node:fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';
import { SeedConfig } from './types.js';

// Zod schema for validation
const EntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  alignment: z.string(),
  appearance: z.object({
    form: z.string(),
    height: z.string(),
    features: z.array(z.record(z.string())).optional()
  }).optional(),
  powers: z.array(z.object({
    name: z.string(),
    description: z.string()
  })).optional(),
  lore: z.object({
    origin: z.string(),
    purpose: z.string(),
    weaknesses: z.string()
  }).optional(),
  relationships: z.array(z.object({
    entity: z.string(),
    type: z.string(),
    notes: z.string()
  })).optional()
}).optional();

const EnvironmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  features: z.array(z.record(z.string())),
  seasons: z.array(z.object({
    name: z.string(),
    events: z.array(z.string())
  })).optional()
}).optional();

const SeedSchema = z.object({
  name: z.string(),
  version: z.string(),
  author: z.string(),
  description: z.string(),
  entity: EntitySchema,
  environment: EnvironmentSchema,
  quests: z.array(z.object({
    name: z.string(),
    trigger: z.string(),
    objective: z.string()
  })).optional(),
  export: z.record(z.any()).optional()
});

/**
 * Loads and parses a seed file
 * @param path Path to the seed file (YAML or JSON)
 * @returns Parsed and validated seed configuration
 */
export async function parseSeedFile(path: string): Promise<SeedConfig> {
  // Read the file
  const content = await fs.promises.readFile(path, 'utf8');
  
  // Parse based on file extension
  let data: any;
  if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    data = yaml.load(content);
  } else if (path.endsWith('.json')) {
    data = JSON.parse(content);
  } else {
    throw new Error('Unsupported file format. Only YAML and JSON are supported.');
  }
  
  // Validate against schema
  const result = SeedSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(`Invalid seed file: ${result.error.message}`);
  }
  
  return result.data as SeedConfig;
}

/**
 * Creates a new seed file from a template
 * @param templateName Name of the template to use
 * @param outputPath Path to save the new seed file
 * @param customValues Custom values to override in the template
 */
export async function createSeedFromTemplate(
  templateName: string, 
  outputPath: string, 
  customValues: Partial<SeedConfig> = {}
): Promise<void> {
  // Implementation details for template-based seed creation
  // This would typically load a template, merge with custom values, and save to outputPath
  throw new Error('Not implemented yet');
}

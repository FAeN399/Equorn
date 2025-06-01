/**
 * @equorn/core - Main entry point
 * The core engine for Equorn's myth generation
 */

// Direct export from standalone implementation to make README example work
export { buildGuardian } from './standalone.js';
export type { BuildGuardianOptions, GenerationResult } from './standalone.js';

// Export the seed generation functionality needed by the CLI
export { generateFromSeed } from './api/generateFromSeed.js';
export type { GenerationOptions } from './types.js';
export * from './types.js';

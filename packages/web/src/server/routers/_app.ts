import { z } from 'zod';
import { procedure, router } from '../trpc';
import { buildGuardian } from '@equorn/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const appRouter = router({
  // Get all available templates
  getTemplates: procedure.query(async () => {
    try {
      // This would typically come from a database or file system
      return [
        { id: 'guardian', name: 'Guardian', description: 'A mythical protector entity' },
        { id: 'artifact', name: 'Artifact', description: 'A powerful magical item' },
        { id: 'realm', name: 'Realm', description: 'A mythical world or domain' }
      ];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }),
  
  // Generate a project from a seed file
  generateProject: procedure
    .input(z.object({
      seed: z.object({
        name: z.string(),
        entity: z.object({
          name: z.string(),
          type: z.string(),
        }).optional(),
        // Add more seed properties as needed
      }),
      target: z.enum(['godot', 'unity', 'web', 'docs']),
      outputDir: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Create a temporary seed file
        const tempDir = os.tmpdir();
        const seedPath = path.join(tempDir, `${input.seed.name.replace(/\s+/g, '-')}.yaml`);
        
        // We would convert the input object to YAML here
        // For now, just write a placeholder
        await fs.promises.writeFile(seedPath, JSON.stringify(input.seed, null, 2), 'utf8');
        
        // Build the project
        await buildGuardian({
          seedPath,
          target: input.target,
          outputDir: input.outputDir,
          verbose: true
        });
        
        return {
          success: true,
          outputDir: input.outputDir || path.join(process.cwd(), 'output', input.target),
        };
      } catch (error: unknown) {
        console.error('Error generating project:', error);
        throw new Error(
          `Failed to generate project: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }),
});

export type AppRouter = typeof appRouter;

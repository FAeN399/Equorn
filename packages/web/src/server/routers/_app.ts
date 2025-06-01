import { z } from 'zod';
import { procedure, router } from '../trpc';
import { buildGuardian } from '@equorn/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as yaml from 'js-yaml';

// Project file type
interface ProjectFile {
  path: string;
  content: string;
  size: number;
}

// Helper function to find the project root
function findProjectRoot(): string {
  let currentDir = process.cwd();
  
  // If we're in the web package, go up to find the project root
  if (currentDir.includes('packages/web')) {
    const webIndex = currentDir.indexOf('packages/web');
    return currentDir.substring(0, webIndex);
  }
  
  // Try to find package.json with "equorn" name
  while (currentDir !== path.dirname(currentDir)) {
    try {
      const packagePath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.name === 'equorn' || packageJson.workspaces) {
          return currentDir;
        }
      }
    } catch (error) {
      // Continue searching
    }
    currentDir = path.dirname(currentDir);
  }
  
  // Fallback to current working directory
  return process.cwd();
}

// Seed validation schema
const seedSchema = z.object({
  world: z.object({
    name: z.string(),
    description: z.string(),
    theme: z.string().optional(),
  }),
  entities: z.array(z.object({
    type: z.string(),
    name: z.string(),
    description: z.string(),
    location: z.string().optional(),
    abilities: z.array(z.string()).optional(),
  })).optional(),
  locations: z.array(z.object({
    name: z.string(),
    description: z.string(),
    connections: z.array(z.string()).optional(),
  })).optional(),
  interactions: z.array(z.object({
    trigger: z.string(),
    type: z.string(),
    responses: z.array(z.string()).optional(),
  })).optional(),
});

// Helper function for scanning directories
async function scanDirectory(dir: string, baseDir: string, files: ProjectFile[]): Promise<void> {
  const items = await fs.promises.readdir(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      await scanDirectory(fullPath, baseDir, files);
    } else {
      const content = await fs.promises.readFile(fullPath, 'utf8');
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        path: relativePath,
        content,
        size: stat.size,
      });
    }
  }
}

export const appRouter = router({
  // Get all available templates/seeds
  getTemplates: procedure.query(async () => {
    try {
      const projectRoot = findProjectRoot();
      const seedsDir = path.join(projectRoot, 'seeds');
      const seeds = [];
      
      try {
        const files = await fs.promises.readdir(seedsDir);
        for (const file of files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))) {
          const content = await fs.promises.readFile(path.join(seedsDir, file), 'utf8');
          const seedData = yaml.load(content) as any;
          seeds.push({
            id: file.replace(/\.(yaml|yml)$/, ''),
            name: seedData.world?.name || file,
            description: seedData.world?.description || 'A mythic world',
            theme: seedData.world?.theme || 'unknown',
            file: file,
          });
        }
      } catch (dirError) {
        console.log('Seeds directory not found, using default templates');
      }

      // Add default templates if no seeds found
      if (seeds.length === 0) {
        return [
          { 
            id: 'forest-guardian', 
            name: 'Forest Guardian', 
            description: 'A mystical protector of ancient woodlands',
            theme: 'nature',
            file: 'forest-guardian.yaml'
          },
          { 
            id: 'mystic-tower', 
            name: 'Mystic Tower', 
            description: 'An enigmatic spire filled with arcane secrets',
            theme: 'magic',
            file: 'mystic-tower.yaml'
          },
          { 
            id: 'ocean-depths', 
            name: 'Ocean Depths', 
            description: 'Mysterious underwater realms',
            theme: 'aquatic',
            file: 'ocean-depths.yaml'
          }
        ];
      }
      
      return seeds;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }),

  // Get a specific seed file content
  getSeed: procedure
    .input(z.object({ seedId: z.string() }))
    .query(async ({ input }) => {
      try {
        const projectRoot = findProjectRoot();
        const seedsDir = path.join(projectRoot, 'seeds');
        const seedPath = path.join(seedsDir, `${input.seedId}.yaml`);
        
        const content = await fs.promises.readFile(seedPath, 'utf8');
        const seedData = yaml.load(content);
        
        return {
          content,
          data: seedData,
          path: seedPath,
        };
      } catch (error) {
        console.error('Error reading seed:', error);
        throw new Error(`Failed to read seed: ${input.seedId}`);
      }
    }),

  // Validate a seed structure
  validateSeed: procedure
    .input(z.object({ 
      seedContent: z.string(),
      format: z.enum(['yaml', 'json']).default('yaml')
    }))
    .mutation(async ({ input }) => {
      try {
        const data = input.format === 'yaml' 
          ? yaml.load(input.seedContent)
          : JSON.parse(input.seedContent);
        
        const validation = seedSchema.safeParse(data);
        
        return {
          valid: validation.success,
          errors: validation.success ? [] : validation.error.errors,
          data: validation.success ? validation.data : null,
        };
      } catch (error) {
        return {
          valid: false,
          errors: [`Parse error: ${error instanceof Error ? error.message : 'Invalid format'}`],
          data: null,
        };
      }
    }),

  // Generate a project from a seed
  generateProject: procedure
    .input(z.object({
      seedId: z.string().optional(),
      seedContent: z.string().optional(), 
      target: z.enum(['godot', 'unity', 'web', 'docs']),
      outputDir: z.string().optional(),
      projectName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        let seedPath: string;
        const timestamp = Date.now();
        const projectName = input.projectName || `project-${timestamp}`;
        const projectRoot = findProjectRoot();
        
        if (input.seedId) {
          // Use existing seed file
          const seedsDir = path.join(projectRoot, 'seeds');
          seedPath = path.join(seedsDir, `${input.seedId}.yaml`);
        } else if (input.seedContent) {
          // Create temporary seed file from content
          const tempDir = os.tmpdir();
          seedPath = path.join(tempDir, `${projectName}-${timestamp}.yaml`);
          await fs.promises.writeFile(seedPath, input.seedContent, 'utf8');
        } else {
          throw new Error('Either seedId or seedContent must be provided');
        }

        // Ensure output directory exists
        const outputBase = input.outputDir || path.join(projectRoot, 'output');
        const outputDir = path.join(outputBase, input.target, projectName);
        await fs.promises.mkdir(outputDir, { recursive: true });

        // Generate the project
        const startTime = Date.now();
        const result = await buildGuardian({
          seedPath,
          target: input.target,
          outputDir,
          verbose: true
        });

        const duration = Date.now() - startTime;

        // Clean up temporary file if created
        if (input.seedContent && !input.seedId) {
          try {
            await fs.promises.unlink(seedPath);
          } catch (cleanupError) {
            console.warn('Failed to cleanup temporary seed file:', cleanupError);
          }
        }

        return {
          success: true,
          outputPath: result.outputPath,
          files: result.files,
          metadata: {
            ...result.metadata,
            duration,
            projectName,
          },
        };
      } catch (error: unknown) {
        console.error('Error generating project:', error);
        throw new Error(
          `Failed to generate project: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }),

  // Get generation history/status
  getGenerationHistory: procedure.query(async () => {
    try {
      const projectRoot = findProjectRoot();
      const outputDir = path.join(projectRoot, 'output');
      const history = [];
      
      try {
        const targets = await fs.promises.readdir(outputDir);
        for (const target of targets) {
          const targetPath = path.join(outputDir, target);
          const stat = await fs.promises.stat(targetPath);
          if (stat.isDirectory()) {
            const projects = await fs.promises.readdir(targetPath);
            for (const project of projects) {
              const projectPath = path.join(targetPath, project);
              const projectStat = await fs.promises.stat(projectPath);
              if (projectStat.isDirectory()) {
                history.push({
                  id: `${target}-${project}`,
                  projectName: project,
                  target,
                  createdAt: projectStat.birthtime,
                  path: projectPath,
                });
              }
            }
          }
        }
      } catch (dirError) {
        console.log('Output directory not found');
      }

      return history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching generation history:', error);
      throw new Error('Failed to fetch generation history');
    }
  }),

  // Download generated project files
  downloadProject: procedure
    .input(z.object({ 
      target: z.string(),
      projectName: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const projectRoot = findProjectRoot();
        const projectPath = path.join(projectRoot, 'output', input.target, input.projectName);
        const files: ProjectFile[] = [];
        
        await scanDirectory(projectPath, projectPath, files);
        
        return {
          projectName: input.projectName,
          target: input.target,
          files,
          totalSize: files.reduce((sum, f) => sum + f.size, 0),
        };
      } catch (error) {
        console.error('Error reading project files:', error);
        throw new Error('Failed to read project files');
      }
    }),
});

export type AppRouter = typeof appRouter;

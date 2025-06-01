import { expect, vi, describe, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'node:path';

// Import the functions we want to test
import { 
  generateFromSeed,
  generateGodotProject,
  generateUnityProject,
  generateWebProject,
  generateDocsProject
} from '../../packages/core/src/generators/index.js';

// Mock the parser module to return consistent test data
vi.mock('../../packages/core/src/parser.js', () => ({
  parseSeedFile: vi.fn().mockResolvedValue({
    name: 'Test World',
    description: 'A test world for unit tests',
    entity: { 
      name: 'TestEntity', 
      description: 'A test entity',
      type: 'guardian',
      alignment: 'neutral'
    },
    environment: { 
      name: 'TestEnv', 
      description: 'A test environment',
      type: 'forest'
    },
    version: '1.0.0',
    author: 'Test Author'
  })
}));

describe('Generator Module Tests', () => {
  const testOutputDir = './test-output';

  beforeEach(async () => {
    // Clean up test output directory before each test
    await fs.remove(testOutputDir);
  });

  afterEach(async () => {
    // Clean up test output directory after each test
    await fs.remove(testOutputDir);
  });

  describe('generateFromSeed', () => {
    it('should call the correct target generator based on options', async () => {
      const seedPath = 'test/seed.yaml';
      
      // Test Godot target
      await generateFromSeed(seedPath, { target: 'godot', outputDir: `${testOutputDir}/godot`, verbose: false });
      expect(await fs.pathExists(`${testOutputDir}/godot`)).toBe(true);
      
      // Test Unity target
      await generateFromSeed(seedPath, { target: 'unity', outputDir: `${testOutputDir}/unity`, verbose: false });
      expect(await fs.pathExists(`${testOutputDir}/unity`)).toBe(true);
      
      // Test Web target
      await generateFromSeed(seedPath, { target: 'web', outputDir: `${testOutputDir}/web`, verbose: false });
      expect(await fs.pathExists(`${testOutputDir}/web`)).toBe(true);
      
      // Test Docs target
      await generateFromSeed(seedPath, { target: 'docs', outputDir: `${testOutputDir}/docs`, verbose: false });
      expect(await fs.pathExists(`${testOutputDir}/docs`)).toBe(true);
    });
  });

  describe('generateGodotProject', () => {
    it('should generate a Godot project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entity: { 
          name: 'TestEntity', 
          description: 'A test entity',
          type: 'guardian',
          alignment: 'neutral'
        },
        environment: { 
          name: 'TestEnv', 
          description: 'A test environment',
          type: 'forest'
        },
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = `${testOutputDir}/godot`;
      
      await generateGodotProject(seed, outputDir, false);
      
      // Verify key files were created
      expect(await fs.pathExists(path.join(outputDir, 'project.godot'))).toBe(true);
      expect(await fs.pathExists(path.join(outputDir, 'scenes'))).toBe(true);
      expect(await fs.pathExists(path.join(outputDir, 'scripts'))).toBe(true);
      expect(await fs.pathExists(path.join(outputDir, 'README.md'))).toBe(true);
    });
  });

  describe('generateUnityProject', () => {
    it('should generate a Unity project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entity: { 
          name: 'TestEntity', 
          description: 'A test entity',
          type: 'guardian',
          alignment: 'neutral'
        },
        environment: { 
          name: 'TestEnv', 
          description: 'A test environment',
          type: 'forest'
        },
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = `${testOutputDir}/unity`;
      
      await generateUnityProject(seed, outputDir, false);
      
      // Verify directory was created (Unity generator may be minimal)
      expect(await fs.pathExists(outputDir)).toBe(true);
    });
  });

  describe('generateWebProject', () => {
    it('should generate a Web project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entity: { 
          name: 'TestEntity', 
          description: 'A test entity',
          type: 'guardian',
          alignment: 'neutral'
        },
        environment: { 
          name: 'TestEnv', 
          description: 'A test environment',
          type: 'forest'
        },
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = `${testOutputDir}/web`;
      
      await generateWebProject(seed, outputDir, false);
      
      // Verify directory was created (Web generator may be minimal)
      expect(await fs.pathExists(outputDir)).toBe(true);
    });
  });

  describe('generateDocsProject', () => {
    it('should generate a Docs project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entity: { 
          name: 'TestEntity', 
          description: 'A test entity',
          type: 'guardian',
          alignment: 'neutral'
        },
        environment: { 
          name: 'TestEnv', 
          description: 'A test environment',
          type: 'forest'
        },
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = `${testOutputDir}/docs`;
      
      await generateDocsProject(seed, outputDir, false);
      
      // Verify directory was created (Docs generator may be minimal)
      expect(await fs.pathExists(outputDir)).toBe(true);
    });
  });
});

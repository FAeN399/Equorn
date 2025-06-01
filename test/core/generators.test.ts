import { expect, vi, describe, it, beforeEach, afterEach } from 'vitest';
import * as path from 'node:path';
import { generateFromSeed } from '../../packages/core/src/generator/index.js';
import { 
  generateGodotProject, 
  generateUnityProject, 
  generateWebProject,
  generateDocsProject
} from '../../packages/core/src/generators/index.js';

// Define interface for our mock fs-extra module
interface MockFsExtra {
  ensureDir: ReturnType<typeof vi.fn>;
  writeFile: ReturnType<typeof vi.fn>;
  readFile: ReturnType<typeof vi.fn>;
  writeJson: ReturnType<typeof vi.fn>;
  copy: ReturnType<typeof vi.fn>;
  pathExists: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  promises?: {
    ensureDir: ReturnType<typeof vi.fn>;
    writeFile: ReturnType<typeof vi.fn>;
    readFile: ReturnType<typeof vi.fn>;
    writeJson: ReturnType<typeof vi.fn>;
    copy: ReturnType<typeof vi.fn>;
    pathExists: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
}

// Create mock functions with spies that we can track
const mockFsExtra: MockFsExtra = {
  ensureDir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockImplementation((path) => {
    if (path.includes('seed.yaml') || path.includes('seed.json')) {
      return Promise.resolve(JSON.stringify({
        name: 'Test World',
        description: 'A test world for unit tests',
        entities: [
          { name: 'TestEntity', description: 'A test entity' }
        ],
        environments: [
          { name: 'TestEnv', description: 'A test environment' }
        ],
        version: '1.0.0',
        author: 'Test Author'
      }));
    }
    return Promise.reject(new Error('File not found'));
  }),
  writeJson: vi.fn().mockResolvedValue(undefined),
  copy: vi.fn().mockResolvedValue(undefined),
  pathExists: vi.fn().mockResolvedValue(true),
  remove: vi.fn().mockResolvedValue(undefined)
};

// Create a promises property that references the same mock functions
mockFsExtra.promises = {
  ensureDir: mockFsExtra.ensureDir,
  writeFile: mockFsExtra.writeFile,
  readFile: mockFsExtra.readFile,
  writeJson: mockFsExtra.writeJson,
  copy: mockFsExtra.copy,
  pathExists: mockFsExtra.pathExists,
  remove: mockFsExtra.remove
};

// Mock fs-extra module
vi.mock('fs-extra', () => mockFsExtra);

// Mock the parser module
vi.mock('../../packages/core/src/parser.js', () => ({
  parseSeedFile: vi.fn().mockResolvedValue({
    name: 'Test World',
    description: 'A test world for unit tests',
    entities: [
      { name: 'TestEntity', description: 'A test entity' }
    ],
    environments: [
      { name: 'TestEnv', description: 'A test environment' }
    ],
    version: '1.0.0',
    author: 'Test Author'
  })
}));

// Mock path module
vi.mock('node:path', () => ({
  join: vi.fn((...args) => args.join('/')),
  resolve: vi.fn((...args) => args.join('/')),
  dirname: vi.fn((p) => p.split('/').slice(0, -1).join('/') || '.'),
  basename: vi.fn((p) => p.split('/').pop() || ''),
  extname: vi.fn((p) => {
    const parts = p.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  })
}));

// Alias for path mock to support code importing 'path' instead of 'node:path'
vi.mock('path', () => vi.importActual('node:path'));

describe('Generator Module Tests', () => {
  beforeEach(() => {
    // Clear all existing mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('generateFromSeed', () => {
    it('should call the correct target generator based on options', async () => {
      const seedPath = 'test/seed.yaml';
      const outputBase = './output';
      
      // Test Godot target
      await generateFromSeed(seedPath, { target: 'godot', outputDir: `${outputBase}/godot`, verbose: true });
      expect(mockFsExtra.ensureDir).toHaveBeenCalledWith(`${outputBase}/godot`);
      
      // Test Unity target
      await generateFromSeed(seedPath, { target: 'unity', outputDir: `${outputBase}/unity`, verbose: true });
      expect(mockFsExtra.ensureDir).toHaveBeenCalledWith(`${outputBase}/unity`);
      
      // Test Web target
      await generateFromSeed(seedPath, { target: 'web', outputDir: `${outputBase}/web`, verbose: true });
      expect(mockFsExtra.ensureDir).toHaveBeenCalledWith(`${outputBase}/web`);
      
      // Test Docs target
      await generateFromSeed(seedPath, { target: 'docs', outputDir: `${outputBase}/docs`, verbose: true });
      expect(mockFsExtra.ensureDir).toHaveBeenCalledWith(`${outputBase}/docs`);
    });
  });

  describe('generateGodotProject', () => {
    it('should generate a Godot project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entities: [
          { name: 'TestEntity', description: 'A test entity' }
        ],
        environments: [
          { name: 'TestEnv', description: 'A test environment' }
        ],
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = './output/godot';
      
      await generateGodotProject(seed, outputDir, true);
      
      // Verify directory creation
      expect(mockFsExtra.ensureDir).toHaveBeenCalled();
      expect(mockFsExtra.writeFile).toHaveBeenCalled();
    });
  });

  describe('generateUnityProject', () => {
    it('should generate a Unity project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entities: [
          { name: 'TestEntity', description: 'A test entity' }
        ],
        environments: [
          { name: 'TestEnv', description: 'A test environment' }
        ],
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = './output/unity';
      
      await generateUnityProject(seed, outputDir, true);
      
      // Verify directory creation
      expect(mockFsExtra.ensureDir).toHaveBeenCalled();
      expect(mockFsExtra.writeFile).toHaveBeenCalled();
    });
  });

  describe('generateWebProject', () => {
    it('should generate a Web project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entities: [
          { name: 'TestEntity', description: 'A test entity' }
        ],
        environments: [
          { name: 'TestEnv', description: 'A test environment' }
        ],
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = './output/web';
      
      await generateWebProject(seed, outputDir, true);
      
      // Verify directory creation
      expect(mockFsExtra.ensureDir).toHaveBeenCalled();
      expect(mockFsExtra.writeFile).toHaveBeenCalled();
    });
  });

  describe('generateDocsProject', () => {
    it('should generate a Docs project structure', async () => {
      const seed = {
        name: 'Test World',
        description: 'A test world for unit tests',
        entities: [
          { name: 'TestEntity', description: 'A test entity' }
        ],
        environments: [
          { name: 'TestEnv', description: 'A test environment' }
        ],
        version: '1.0.0',
        author: 'Test Author'
      };
      const outputDir = './output/docs';
      
      await generateDocsProject(seed, outputDir, true);
      
      // Verify directory creation
      expect(mockFsExtra.ensureDir).toHaveBeenCalled();
      expect(mockFsExtra.writeFile).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseSeedFile } from '../../packages/core/src/parser';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
  }
}));

describe('Parser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('parseSeedFile', () => {
    it('should correctly parse a valid YAML seed file', async () => {
      const mockYamlContent = `
name: Forest Guardian
version: 1.0.0
author: Equorn Team
description: A mythical guardian that protects an ancient forest
entity:
  name: Sylvan Sentinel
  type: guardian
  alignment: neutral-good
`;

      // Set up the mock implementation for this test
      vi.mocked(fs.promises.readFile).mockResolvedValue(mockYamlContent);

      const result = await parseSeedFile('test.yaml');

      expect(result).toMatchObject({
        name: 'Forest Guardian',
        version: '1.0.0',
        author: 'Equorn Team',
        description: 'A mythical guardian that protects an ancient forest',
        entity: {
          name: 'Sylvan Sentinel',
          type: 'guardian',
          alignment: 'neutral-good'
        }
      });
    });

    it('should throw an error for invalid seed files', async () => {
      const invalidYaml = `
name: Invalid Seed
version: missing-quotes
invalid-structure
      `;

      vi.mocked(fs.promises.readFile).mockResolvedValue(invalidYaml);

      await expect(parseSeedFile('invalid.yaml')).rejects.toThrow();
    });

    it('should throw an error for unsupported file formats', async () => {
      await expect(parseSeedFile('test.txt')).rejects.toThrow('Unsupported file format');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { spawnUnityGenerator } from '../../packages/core/src/standalone.js';

describe('spawnUnityGenerator export', () => {
  it('should be a function', () => {
    expect(typeof spawnUnityGenerator).toBe('function');
  });
});

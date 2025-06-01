// scripts/ai-code-analysis.ts
import { ESLint } from 'eslint';
import * as fs from 'fs/promises';

export async function validateAIGeneratedCode(filePaths: string[]) {
  const eslint = new ESLint({
    baseConfig: {
      extends: ['@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // Stricter rules for AI-generated code
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'complexity': ['error', { max: 10 }]
      }
    } as any
  });

  const results = await eslint.lintFiles(filePaths);
  const hasErrors = results.some(result => result.errorCount > 0);

  if (hasErrors) {
    console.log('❌ AI-generated code failed static analysis');
    ESLint.outputFixes(results);
    return false;
  }

  console.log('✅ AI-generated code passed static analysis');
  return true;
}
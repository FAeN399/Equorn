// Simple test script for the buildGuardian API
import { buildGuardian } from './packages/core/dist/index.js';

try {
  const result = await buildGuardian({
    seedPath: './seeds/forest-guardian.yaml',
    target: 'godot',
    verbose: true
  });
  
  console.log('✅ Success!', result);
} catch (error) {
  console.error('❌ Failed:', error.message);
}

/**
 * Guardian Builder for Equorn
 * Specialized builder for creating guardian entities
 */
import * as path from 'node:path';
import * as fs from 'node:fs';
import { parseSeedFile } from '../parser.js';
import { GenerationOptions, SeedConfig } from '../types.js';

/**
 * Main function to build a guardian from a seed file
 * @param seed The parsed seed configuration
 * @param options Build options including output directory and target
 */
export async function buildGuardian(seed: SeedConfig, options: GenerationOptions): Promise<void> {
  try {
    if (!seed.entity || seed.entity.type !== 'guardian') {
      throw new Error('The specified seed does not contain a guardian entity type');
    }
    // Create output directory if it doesn't exist
    const outputDir = options.outputDir || path.join(process.cwd(), 'output', options.target);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate the guardian output files based on target
    switch (options.target) {
      case 'godot':
        await generateGodotGuardian(seed, outputDir);
        break;
      case 'unity':
        await generateUnityGuardian(seed, outputDir);
        break;
      case 'web':
        await generateWebGuardian(seed, outputDir);
        break;
      case 'docs':
        await generateDocsGuardian(seed, outputDir);
        break;
      default:
        throw new Error(`Unsupported target: ${options.target}`);
    }
    
    if (options.verbose) {
      console.log(`Guardian "${seed.entity.name}" successfully built for target: ${options.target}`);
      console.log(`Output directory: ${outputDir}`);
    }
  } catch (error) {
    console.error('Error building guardian:', error);
    throw error;
  }
}

/**
 * Helper function to enhance a guardian seed with additional attributes
 * @param seed Base seed configuration
 * @returns Enhanced seed with additional guardian attributes
 */
export function enhanceGuardianSeed(seed: SeedConfig): SeedConfig {
  // This is where we would add computed or derived properties to the guardian
  // For example, generating additional lore, relationships, or powers based on the seed data
  return {
    ...seed,
    // Add additional computed properties here
  };
}

/**
 * Generate Godot project files for a guardian entity
 * @param seed The parsed seed configuration
 * @param outputDir Directory to write output files
 */
async function generateGodotGuardian(seed: SeedConfig, outputDir: string): Promise<void> {
  if (!seed.entity) {
    throw new Error('Invalid seed: missing entity information');
  }

  // Create a basic project.godot file
  const projectFile = `; Engine configuration file.
; Generated for ${seed.name}

[application]
name="${seed.name}"
config/icon="res://icon.png"

[rendering]
environment/default_environment="res://default_env.tres"
`;
  
  // Create a README with information about the guardian
  const readmeContent = `# ${seed.name}

${seed.description}

## Guardian: ${seed.entity.name}

${seed.entity.type} - ${seed.entity.alignment}

### Lore
${seed.entity.lore?.origin || 'Origin unknown'}
`;

  // Write files to output directory
  await fs.promises.writeFile(path.join(outputDir, 'project.godot'), projectFile);
  await fs.promises.writeFile(path.join(outputDir, 'README.md'), readmeContent);
}

/**
 * Generate Unity project files for a guardian entity
 * @param seed The parsed seed configuration
 * @param outputDir Directory to write output files
 */
async function generateUnityGuardian(seed: SeedConfig, outputDir: string): Promise<void> {
  if (!seed.entity) {
    throw new Error('Invalid seed: missing entity information');
  }
  // Create a README with information about the Unity guardian project
  const readmeContent = `# ${seed.name} - Unity Project

${seed.description}

## Guardian: ${seed.entity.name}

This is a placeholder for the Unity implementation of the ${seed.entity.name} guardian.
`;

  // Write files to output directory
  await fs.promises.writeFile(path.join(outputDir, 'README.md'), readmeContent);
}

/**
 * Generate web files for a guardian entity
 * @param seed The parsed seed configuration
 * @param outputDir Directory to write output files
 */
async function generateWebGuardian(seed: SeedConfig, outputDir: string): Promise<void> {
  if (!seed.entity) {
    throw new Error('Invalid seed: missing entity information');
  }
  // Create a simple HTML page for the guardian
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seed.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .guardian { border: 1px solid #ddd; padding: 20px; margin-top: 20px; border-radius: 10px; }
  </style>
</head>
<body>
  <h1>${seed.name}</h1>
  <p>${seed.description}</p>
  
  <div class="guardian">
    <h2>${seed.entity.name}</h2>
    <p>Type: ${seed.entity.type}</p>
    <p>Alignment: ${seed.entity.alignment}</p>
    
    ${seed.entity.lore ? `
    <h3>Lore</h3>
    <p>Origin: ${seed.entity.lore.origin}</p>
    <p>Purpose: ${seed.entity.lore.purpose}</p>
    ` : ''}
    
    ${seed.entity.powers ? `
    <h3>Powers</h3>
    <ul>
      ${seed.entity.powers.map(power => `<li><strong>${power.name}</strong>: ${power.description}</li>`).join('\n      ')}
    </ul>
    ` : ''}
  </div>
</body>
</html>
`;

  // Write files to output directory
  await fs.promises.writeFile(path.join(outputDir, 'index.html'), htmlContent);
}

/**
 * Generate documentation files for a guardian entity
 * @param seed The parsed seed configuration
 * @param outputDir Directory to write output files
 */
async function generateDocsGuardian(seed: SeedConfig, outputDir: string): Promise<void> {
  if (!seed.entity) {
    throw new Error('Invalid seed: missing entity information');
  }
  // Create a markdown file documenting the guardian
  const docsContent = `# ${seed.name}

${seed.description}

## Guardian: ${seed.entity.name}

- **Type**: ${seed.entity.type}
- **Alignment**: ${seed.entity.alignment}

${seed.entity.appearance ? `
### Appearance

- **Form**: ${seed.entity.appearance.form}
- **Height**: ${seed.entity.appearance.height}
` : ''}

${seed.entity.lore ? `
### Lore

- **Origin**: ${seed.entity.lore.origin}
- **Purpose**: ${seed.entity.lore.purpose}
- **Weaknesses**: ${seed.entity.lore.weaknesses}
` : ''}

${seed.entity.powers ? `
### Powers

${seed.entity.powers.map(power => `- **${power.name}**: ${power.description}`).join('\n')}
` : ''}

${seed.entity.relationships ? `
### Relationships

${seed.entity.relationships.map(rel => `- **${rel.entity}**: ${rel.type} - ${rel.notes}`).join('\n')}
` : ''}
`;

  // Write files to output directory
  await fs.promises.writeFile(path.join(outputDir, `${seed.entity.name.toLowerCase().replace(/\s+/g, '_')}.md`), docsContent);
}

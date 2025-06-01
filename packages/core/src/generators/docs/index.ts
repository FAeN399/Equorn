/**
 * Documentation Generator module
 * Handles generating MkDocs documentation projects from seed files
 */
import * as path from 'node:path';
import * as fs from 'fs-extra';
import { SeedConfig, QuestConfig, EntityConfig, EnvironmentConfig, ExportTargetConfig } from '../../types.js';

/**
 * Generate a documentation project from a seed
 */
export async function generateDocsProject(
  seed: SeedConfig, 
  outputDir: string, 
  verbose?: boolean
): Promise<void> {
  if (verbose) {
    console.log('Generating documentation project...');
  }
  
  // Create project structure
  await fs.ensureDir(path.join(outputDir, 'docs'));
  await fs.ensureDir(path.join(outputDir, 'docs', 'quests'));
  await fs.ensureDir(path.join(outputDir, 'docs', 'entities'));
  await fs.ensureDir(path.join(outputDir, 'docs', 'environments'));
  
  // Get theme from seed or use default
  const theme = seed.export?.docs?.theme || 'material';
  
  // Create MkDocs configuration
  await fs.writeFile(
    path.join(outputDir, 'mkdocs.yml'),
    generateMkDocsConfig(seed, theme)
  );
  
  // Create index page
  await fs.writeFile(
    path.join(outputDir, 'docs', 'index.md'),
    generateIndexPage(seed)
  );
  
  // Create entity pages if they exist
  if (seed.entity) {
    await fs.writeFile(
      path.join(outputDir, 'docs', 'entities', `${seed.entity.name}.md`),
      generateEntityPage(seed.entity)
    );
  }
  
  // Create environment pages if they exist
  if (seed.environment) {
    await fs.writeFile(
      path.join(outputDir, 'docs', 'environments', `${seed.environment.name}.md`),
      generateEnvironmentPage(seed.environment)
    );
  }
  
  // Create quest pages if they exist
  if (seed.quests && seed.quests.length > 0) {
    for (const quest of seed.quests) {
      const filename = quest.name.replace(/\s+/g, '_').toLowerCase();
      await fs.writeFile(
        path.join(outputDir, 'docs', 'quests', `${filename}.md`),
        generateQuestPage(quest, seed)
      );
    }
  }
  
  // Create README
  await fs.writeFile(
    path.join(outputDir, 'README.md'),
    `# ${seed.entity?.name || 'Mythic'} Documentation
    
This is a generated documentation project for ${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}.

## Getting Started

1. Install MkDocs: \`pip install mkdocs mkdocs-material\`
2. Build the docs: \`mkdocs build\` 
3. Serve the docs locally: \`mkdocs serve\`
4. Access at http://localhost:8000
    `
  );
  
  if (verbose) {
    console.log('Documentation project generated successfully!');
  }
}

/**
 * Generate MkDocs configuration YAML
 */
export function generateMkDocsConfig(seed: SeedConfig, theme: string): string {
  // Get site name from seed or use default
  const siteName = seed.name || `${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}`;
  
  // Get site description from seed or use default
  const siteDescription = seed.description || `Documentation for ${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}`;
  
  // Get theme settings
  let themeSettings: string[] = [];
  // Extract custom coloring from export configuration
  const docsConfig = seed.export?.docs as ExportTargetConfig | undefined;
  
  if (docsConfig) {
    if (docsConfig.primaryColor) {
      themeSettings.push(`    primary: '${docsConfig.primaryColor}'`);
    }
    if (docsConfig.accentColor) {
      themeSettings.push(`    accent: '${docsConfig.accentColor}'`);
    }
  }
  
  // Build navigation structure
  let navItems: string[] = [];
  navItems.push('  - Home: index.md');
  
  // Add entities to navigation if they exist
  if (seed.entity) {
    navItems.push('  - Entities:');
    navItems.push(`      - ${seed.entity.name}: entities/${seed.entity.name}.md`);
  }
  
  // Add environments to navigation if they exist
  if (seed.environment) {
    navItems.push('  - Environments:');
    navItems.push(`      - ${seed.environment.name}: environments/${seed.environment.name}.md`);
  }
  
  // Add quests to navigation if they exist
  if (seed.quests && seed.quests.length > 0) {
    navItems.push('  - Quests:');
    for (const quest of seed.quests) {
      const filename = quest.name.replace(/\s+/g, '_').toLowerCase();
      navItems.push(`      - ${quest.name}: quests/${filename}.md`);
    }
  }
  
  // Build the full configuration
  return `# MkDocs Configuration
# Generated with Equorn

# Site information
site_name: ${siteName}
site_description: ${siteDescription}
site_author: Generated with Equorn

# Theme settings
theme:
  name: ${theme}
${themeSettings.length > 0 ? '  palette:\n' + themeSettings.join('\n') : ''}
  features:
    - navigation.instant
    - navigation.tracking
    - navigation.expand
    - navigation.indexes
    - toc.integrate
    - content.code.copy

# Navigation structure
nav:
${navItems.join('\n')}

# Extensions
markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
  - meta
  - tables

# Extra configuration
extra:
  generator: false
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/yourusername/equorn
`;
}

/**
 * Generate index page content
 */
export function generateIndexPage(seed: SeedConfig): string {
  // Get title from seed or use default
  const title = seed.name || `${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}`;
  
  // Get description from seed or use default
  const description = seed.description || `Documentation for ${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}`;
  
  return `# ${escapeMarkdown(title)}

${escapeMarkdown(description)}

## Overview

This documentation provides detailed information about the mythical world of ${escapeMarkdown(seed.entity?.name || 'Entity')} in ${escapeMarkdown(seed.environment?.name || 'Environment')}.

${seed.entity ? `
## The Entity: ${escapeMarkdown(seed.entity.name)}

${seed.entity.description ? escapeMarkdown(seed.entity.description) : 'No description available.'}

[Learn more about ${escapeMarkdown(seed.entity.name)}](entities/${seed.entity.name}.md)
` : ''}

${seed.environment ? `
## The Environment: ${escapeMarkdown(seed.environment.name)}

${seed.environment.description ? escapeMarkdown(seed.environment.description) : 'No description available.'}

[Learn more about ${escapeMarkdown(seed.environment.name)}](environments/${seed.environment.name}.md)
` : ''}

${seed.quests && seed.quests.length > 0 ? `
## Quests

${seed.quests.map(quest => {
  const filename = quest.name.replace(/\s+/g, '_').toLowerCase();
  return `- [${escapeMarkdown(quest.name)}](quests/${filename}.md): ${escapeMarkdown(quest.objective || 'No objective available')}`;
}).join('\n')}
` : ''}

---

*Generated with [Equorn](https://github.com/yourusername/equorn) - The Generative Myth Engine.*
`;
}

/**
 * Generate entity page content
 */
export function generateEntityPage(entity: EntityConfig): string {
  // Build attributes section if attributes exist
  let attributesSection = '';
  if (entity.attributes) {
    attributesSection = `
## Attributes

| Attribute | Value |
| --------- | ----- |
${Object.entries(entity.attributes).map(([key, value]) => `| ${escapeMarkdown(key)} | ${escapeMarkdown(String(value))} |`).join('\n')}
`;
  }
  
  return `# ${escapeMarkdown(entity.name)}

**Type:** ${escapeMarkdown(entity.type)}

${entity.description ? escapeMarkdown(entity.description) : 'No description available.'}

${attributesSection}

${entity.effects && entity.effects.length > 0 ? `
## Effects

${entity.effects.map(effect => `- ${escapeMarkdown(effect)}`).join('\n')}
` : ''}

${entity.interactions && entity.interactions.length > 0 ? `
## Interactions

${entity.interactions.map(interaction => `- **${escapeMarkdown(interaction.trigger)}**: ${escapeMarkdown(interaction.response)}`).join('\n')}
` : ''}

---

*Generated with Equorn - The Generative Myth Engine.*
`;
}

/**
 * Generate environment page content
 */
export function generateEnvironmentPage(environment: EnvironmentConfig): string {
  return `# ${escapeMarkdown(environment.name)}

**Type:** ${escapeMarkdown(environment.type)}

${environment.description ? escapeMarkdown(environment.description) : 'No description available.'}

${environment.atmosphere ? `
## Atmosphere

- **Sound**: ${escapeMarkdown(environment.atmosphere.sound || 'Not specified')}
- **Light**: ${escapeMarkdown(environment.atmosphere.light || 'Not specified')}
- **Weather**: ${escapeMarkdown(environment.atmosphere.weather || 'Not specified')}
` : ''}

${environment.features && environment.features.length > 0 ? `
## Features

${environment.features.map(feature => {
  const featureName = Object.keys(feature)[0];
  return `- **${escapeMarkdown(featureName)}**: ${escapeMarkdown(feature[featureName])}`;
}).join('\n')}
` : ''}

---

*Generated with Equorn - The Generative Myth Engine.*
`;
}

/**
 * Generate quest page content
 */
export function generateQuestPage(quest: QuestConfig, seed: SeedConfig): string {
  return `# ${escapeMarkdown(quest.name)}

**Objective:** ${escapeMarkdown(quest.objective || 'No objective available')}

${quest.description ? escapeMarkdown(quest.description) : 'No description available.'}

## Details

${quest.trigger ? `**Trigger:** ${escapeMarkdown(quest.trigger)}` : 'No trigger specified.'}

${quest.reward ? `**Reward:** ${escapeMarkdown(quest.reward)}` : 'No reward specified.'}

${quest.steps && quest.steps.length > 0 ? `
## Steps

${quest.steps.map((step, index) => `${index + 1}. ${step.name ? escapeMarkdown(step.name) : 'Unnamed Step'}${step.description ? ': ' + escapeMarkdown(step.description) : ''}`).join('\n')}
` : ''}

---

*Generated with Equorn - The Generative Myth Engine.*
`;
}

/**
 * Escape special Markdown characters to prevent rendering issues
 */
export function escapeMarkdown(text: string | undefined): string {
  if (!text) {
    return '';
  }
  
  // Escape characters that have special meaning in Markdown
  return text
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/\*/g, '\\*')   // Escape asterisks
    .replace(/\_/g, '\\_')   // Escape underscores
    .replace(/\`/g, '\\`')   // Escape backticks
    .replace(/\[/g, '\\[')   // Escape square brackets
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')   // Escape parentheses
    .replace(/\)/g, '\\)')
    .replace(/\#/g, '\\#')   // Escape hash
    .replace(/\+/g, '\\+')   // Escape plus
    .replace(/\-/g, '\\-')   // Escape minus/dash
    .replace(/\|/g, '\\|')   // Escape pipes for tables
    .replace(/\</g, '\\<')   // Escape angle brackets
    .replace(/\>/g, '\\>');
}

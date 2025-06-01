/**
 * Generator for Equorn
 * Handles the generation of output files from seed configurations
 */
import * as path from 'path';
import * as fs from 'fs';
import { SeedConfig, GenerationOptions } from './types.js';

/**
 * Abstract base class for all generators
 */
// Custom Equorn generator base class (not TS Generator type)
export abstract class BaseGenerator {
  protected seed: SeedConfig;
  protected options: GenerationOptions;

  constructor(seed: SeedConfig, options: GenerationOptions) {
    this.seed = seed;
    this.options = options;
  }
  
  /**
   * Main generation method to be implemented by subclasses
   */
  abstract generate(seed: SeedConfig, options: GenerationOptions): Promise<void>;
  
  /**
   * Helper method to ensure output directory exists
   */
  protected async ensureOutputDir(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }
  
  /**
   * Helper method to write a file with content
   */
  protected async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await this.ensureOutputDir(dir);
    await fs.promises.writeFile(filePath, content, 'utf8');
    
    if (this.options.verbose) {
      console.log(`Generated: ${filePath}`);
    }
  }
}

/**
 * Generator for web output (documentation sites, interactive lore pages)
 */
export class WebGenerator extends BaseGenerator {
  async generate(seed: SeedConfig, options: GenerationOptions): Promise<void> {
    const outputDir = options.outputDir || path.join(process.cwd(), 'output', 'web');
    await this.ensureOutputDir(outputDir);
    
    // Generate index.html
    const indexHtml = this.generateIndexHtml(seed);
    await this.writeFile(path.join(outputDir, 'index.html'), indexHtml);
    
    // Generate CSS
    const cssContent = this.generateCss(seed);
    await this.writeFile(path.join(outputDir, 'styles.css'), cssContent);
    
    // Generate JavaScript
    const jsContent = this.generateJs(seed);
    await this.writeFile(path.join(outputDir, 'main.js'), jsContent);
    
    if (options.verbose) {
      console.log(`Web output generated in: ${outputDir}`);
    }
  }
  
  private generateIndexHtml(seed: SeedConfig): string {
    // Implementation would generate HTML from the seed config
    const { name, description, entity, environment } = seed;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-900 text-slate-200">
  <header class="py-8 px-6 border-b border-indigo-800">
    <h1 class="text-4xl font-bold text-indigo-400">${name}</h1>
    <p class="mt-2 text-xl">${description}</p>
  </header>
  
  <main class="container mx-auto p-6">
    ${entity ? `
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4 text-turquoise-500">The Guardian: ${entity.name}</h2>
      <div class="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold mb-2">Essence</h3>
            <p class="mb-4">Type: ${entity.type}</p>
            <p class="mb-4">Alignment: ${entity.alignment}</p>
            ${entity.lore ? `
            <h3 class="text-xl font-semibold mt-6 mb-2">Lore</h3>
            <p class="mb-2">${entity.lore.origin}</p>
            <p class="mb-2">Purpose: ${entity.lore.purpose}</p>
            <p>Weaknesses: ${entity.lore.weaknesses}</p>
            ` : ''}
          </div>
          <div>
            ${entity.appearance ? `
            <h3 class="text-xl font-semibold mb-2">Appearance</h3>
            <p class="mb-2">Form: ${entity.appearance.form}</p>
            <p class="mb-2">Height: ${entity.appearance.height}</p>
            ` : ''}
            ${entity.powers && entity.powers.length > 0 ? `
            <h3 class="text-xl font-semibold mt-6 mb-2">Powers</h3>
            <ul class="list-disc pl-5">
              ${entity.powers.map((power: { name: string; description: string }) => `<li><strong>${power.name}</strong>: ${power.description}</li>`).join('')}
            </ul>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
    ` : ''}
    
    ${environment ? `
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4 text-turquoise-500">Realm: ${environment.name}</h2>
      <div class="bg-slate-800 p-6 rounded-lg shadow-lg">
        <p class="mb-4">Type: ${environment.type}</p>
        
        ${environment.features && environment.features.length > 0 ? `
        <h3 class="text-xl font-semibold mt-6 mb-2">Notable Features</h3>
        <ul class="list-disc pl-5">
          ${environment.features.map((feature: { [key: string]: string }) => {
            const key = Object.keys(feature)[0];
            return `<li><strong>${key}:</strong> ${feature[key]}</li>`;
          }).join('')}
        </ul>
        ` : ''}
        
        ${environment.seasons && environment.seasons.length > 0 ? `
        <h3 class="text-xl font-semibold mt-6 mb-2">Seasons</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${environment.seasons.map((season: { name: string; events: string[] }) => `
          <div class="bg-slate-700 p-4 rounded">
            <h4 class="font-semibold mb-2">${season.name}</h4>
            <ul class="list-disc pl-5">
              ${season.events.map((event: string) => `<li>${event}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </section>
    ` : ''}
    
    ${seed.quests && seed.quests.length > 0 ? `
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4 text-turquoise-500">Quests</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${seed.quests.map((quest: { name: string; trigger: string; objective: string }) => `
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-2">${quest.name}</h3>
          <p class="mb-2"><strong>Trigger:</strong> ${quest.trigger}</p>
          <p><strong>Objective:</strong> ${quest.objective}</p>
        </div>
        `).join('')}
      </div>
    </section>
    ` : ''}
  </main>
  
  <footer class="py-6 px-6 border-t border-indigo-800 text-center text-sm">
    <p>Generated by Equorn • ${new Date().toLocaleDateString()}</p>
    <p class="mt-2">Author: ${seed.author} • Version: ${seed.version}</p>
  </footer>
  
  <script src="main.js"></script>
</body>
</html>`;
  }
  
  private generateCss(seed: SeedConfig): string {
    const theme = seed.export?.web?.theme || 'dark-nature';
    
    // Custom theme colors
    let themeColors = '';
    if (theme === 'dark-nature') {
      themeColors = `
      :root {
        --color-primary: #6366f1;
        --color-secondary: #0d9488;
        --color-background: #0f172a;
        --color-surface: #1e293b;
        --color-text: #e2e8f0;
      }`;
    }
    
    return `/* Equorn Generated Styles */
${themeColors}

/* Base Tailwind-like utilities */
.container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.p-6 { padding: 1.5rem; }
.p-4 { padding: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-12 { margin-bottom: 3rem; }
.ml-2 { margin-left: 0.5rem; }
.pl-5 { padding-left: 1.25rem; }

/* Typography */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-center { text-align: center; }

/* Colors */
.bg-slate-900 { background-color: #0f172a; }
.bg-slate-800 { background-color: #1e293b; }
.bg-slate-700 { background-color: #334155; }
.text-slate-200 { color: #e2e8f0; }
.text-indigo-400 { color: #818cf8; }
.text-turquoise-500 { color: #14b8a6; }
.border-indigo-800 { border-color: #3730a3; }

/* Components */
.border-t { border-top-width: 1px; border-top-style: solid; }
.border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.rounded-lg { border-radius: 0.5rem; }
.rounded { border-radius: 0.25rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.list-disc { list-style-type: disc; }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

/* Responsive */
@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Fonts */
body {
  font-family: '${seed.export?.web?.fonts?.body || 'Montserrat'}', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: '${seed.export?.web?.fonts?.heading || 'Merriweather'}', serif;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

section {
  animation: fadeIn 0.5s ease-out;
}

/* Interactive elements */
.bg-slate-800:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}`;
  }
  
  private generateJs(seed: SeedConfig): string {
    return `// Equorn Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Equorn myth "${seed.name}" loaded');
  
  // Add interactive elements
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    // Add staggered animation delay
    section.style.animationDelay = \`\${index * 0.1}s\`;
    
    // Add click events to section headers
    const header = section.querySelector('h2');
    const content = section.querySelector('div');
    
    if (header && content) {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        const isExpanded = content.style.display === 'none';
        content.style.display = isExpanded ? 'block' : 'none';
        content.style.opacity = isExpanded ? '1' : '0';
        
        if (isExpanded) {
          content.style.animation = 'fadeIn 0.3s ease-out';
        }
      });
    }
  });
});`;
  }
}

/**
 * Factory function to create the appropriate generator based on target
 */
export function createGenerator(seed: SeedConfig, options: GenerationOptions): BaseGenerator {
  switch (options.target) {
    case 'web':
      return new WebGenerator(seed, options);
    // Add other generators here
    default:
      throw new Error(`Unsupported target: ${options.target}`);
  }
}

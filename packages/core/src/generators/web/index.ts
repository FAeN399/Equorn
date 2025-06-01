/**
 * Web Generator module
 * Handles generating web projects from seed files
 */
import * as path from 'node:path';
import * as fs from 'fs-extra';
import { SeedConfig, EntityConfig, EnvironmentConfig } from '../../types.js';

/**
 * Generate a web project from a seed
 */
export async function generateWebProject(
  seed: SeedConfig, 
  outputDir: string, 
  verbose?: boolean
): Promise<void> {
  if (verbose) {
    console.log('Generating Web project...');
  }
  
  // Create project structure
  await fs.ensureDir(path.join(outputDir, 'css'));
  await fs.ensureDir(path.join(outputDir, 'js'));
  await fs.ensureDir(path.join(outputDir, 'assets'));
  
  // Determine theme
  const theme = seed.export?.web?.theme || 'default';
  
  // Create CSS file
  await fs.writeFile(
    path.join(outputDir, 'css', 'style.css'),
    generateWebStylesheet(seed, theme)
  );
  
  // Create JS file
  await fs.writeFile(
    path.join(outputDir, 'js', 'app.js'),
    generateWebJavaScript(seed)
  );
  
  // Create HTML file
  await fs.writeFile(
    path.join(outputDir, 'index.html'),
    generateWebHTML(seed)
  );
  
  // Create README
  await fs.writeFile(
    path.join(outputDir, 'README.md'),
    `# ${seed.entity?.name || 'Mythic'} Web Experience
    
This is a generated web project for the ${seed.entity?.name || 'Entity'} myth.

## Getting Started

1. Open index.html in your browser
2. Alternatively, serve with a static web server:
   \`\`\`
   npx serve
   \`\`\`
    `
  );
  
  if (verbose) {
    console.log('Web project generated successfully!');
  }
}

/**
 * Generate web stylesheet based on seed and theme
 */
export function generateWebStylesheet(seed: SeedConfig, theme: string): string {
  const entityName = seed.entity?.name || 'Entity';
  const envName = seed.environment?.name || 'Environment';
  
  // Get theme-specific variables
  const fontHeading = seed.export?.web?.fonts?.heading || '"Cinzel", serif';
  const fontBody = seed.export?.web?.fonts?.body || '"Roboto", sans-serif';
  
  // Choose colors based on theme
  let primaryColor, secondaryColor, bgColor, textColor;
  
  switch(theme.toLowerCase()) {
    case 'dark':
      primaryColor = '#7c4dff';
      secondaryColor = '#b388ff';
      bgColor = '#121212';
      textColor = '#e0e0e0';
      break;
    case 'nature':
      primaryColor = '#388e3c';
      secondaryColor = '#81c784';
      bgColor = '#f1f8e9';
      textColor = '#263238';
      break;
    case 'mythic':
      primaryColor = '#880e4f';
      secondaryColor = '#ad1457';
      bgColor = '#f3e5f5';
      textColor = '#311b92';
      break;
    case 'aquatic':
      primaryColor = '#0288d1';
      secondaryColor = '#29b6f6';
      bgColor = '#e1f5fe';
      textColor = '#01579b';
      break;
    case 'fiery':
      primaryColor = '#bf360c';
      secondaryColor = '#ff5722';
      bgColor = '#fbe9e7';
      textColor = '#3e2723';
      break;
    default:
      // Default light theme
      primaryColor = '#303f9f';
      secondaryColor = '#5c6bc0';
      bgColor = '#ffffff';
      textColor = '#212121';
  }
  
  return `/* 
 * Generated stylesheet for ${entityName} in ${envName}
 * Theme: ${theme}
 */

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto:wght@300;400;700&display=swap');

:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
  --bg-color: ${bgColor};
  --text-color: ${textColor};
  --font-heading: ${fontHeading};
  --font-body: ${fontBody};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  padding: 20px;
}

header {
  text-align: center;
  padding: 40px 0;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
}

h2 {
  font-size: 2rem;
  color: var(--primary-color);
}

h3 {
  font-size: 1.5rem;
  color: var(--secondary-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.entity-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 5px solid var(--primary-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.environment {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  ${getEnvironmentStyles(seed.environment?.type || 'default')}
}

.quest-item {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 3px solid var(--secondary-color);
}

button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--secondary-color);
}

footer {
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: opacity(var(--text-color), 0.7);
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .container {
    padding: 10px;
  }
}`;
}

/**
 * Get environment-specific CSS styles
 */
function getEnvironmentStyles(type: string): string {
  switch(type.toLowerCase()) {
    case 'forest':
      return `
  background: linear-gradient(to bottom, #1a3a1a, #2d5f2d);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 L60 30 L40 30 Z" fill="%23276727"/><path d="M30 30 L40 60 L20 60 Z" fill="%23276727"/><path d="M70 30 L80 60 L60 60 Z" fill="%23276727"/></svg>');
  background-size: 200px 200px;`;
    
    case 'ocean':
    case 'sea':
      return `
  background: linear-gradient(to bottom, #1a4a73, #2d6ca7);
  background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;`;
      
    case 'mountain':
      return `
  background: linear-gradient(to bottom, #2d3250, #424769);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><path d="M0 50 L20 15 L40 35 L60 10 L80 30 L100 5 L100 50 Z" fill="%232b2b2b"/></svg>');
  background-size: 200px 100px;
  background-position: bottom;`;
      
    case 'desert':
      return `
  background: #e4d6a7;
  background-image: radial-gradient(circle at 10% 20%, rgba(210, 180, 140, 0.2) 2px, transparent 2px);
  background-size: 30px 30px;`;
      
    case 'cave':
    case 'dungeon':
      return `
  background: #1a1a1a;
  background-image: radial-gradient(circle at 10% 20%, rgba(80, 80, 80, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;`;
      
    default:
      return `
  background: linear-gradient(to bottom, #d4e9fd, #f0f8ff);
  background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 20px 20px;`;
  }
}

/**
 * Generate JavaScript for web project
 */
export function generateWebJavaScript(seed: SeedConfig): string {
  return `/**
 * Equorn Generated Web Experience
 * Entity: ${seed.entity?.name || 'Unknown'}
 * Environment: ${seed.environment?.name || 'Unknown'}
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Mythic experience initialized');
  
  // Entity interaction setup
  const entityElement = document.getElementById('entity');
  if (entityElement) {
    entityElement.addEventListener('click', function() {
      showEntityDetails();
    });
  }
  
  ${seed.quests && seed.quests.length > 0 ? `
  // Quest tracking
  const quests = ${JSON.stringify(seed.quests, null, 2)};
  const questStatus = {};
  
  // Initialize quest status
  quests.forEach(quest => {
    questStatus[quest.name] = false; // not completed
  });
  
  // Setup quest triggers
  setupQuestTriggers();
  
  function setupQuestTriggers() {
    const questTriggers = document.querySelectorAll('[data-quest-trigger]');
    questTriggers.forEach(trigger => {
      const questName = trigger.getAttribute('data-quest-trigger');
      trigger.addEventListener('click', function() {
        startQuest(questName);
      });
    });
  }
  
  function startQuest(questName) {
    const quest = quests.find(q => q.name === questName);
    if (quest && !questStatus[questName]) {
      console.log(\`Starting quest: \${questName}\`);
      alert(\`New quest: \${questName}\\n\\nObjective: \${quest.objective}\`);
      
      // Show quest in active quests
      const questList = document.getElementById('active-quests');
      if (questList) {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        questItem.id = \`quest-\${questName.toLowerCase().replace(/\\s+/g, '-')}\`;
        questItem.innerHTML = \`
          <h3>\${questName}</h3>
          <p>\${quest.objective}</p>
          <button class="complete-quest" data-quest-name="\${questName}">Complete</button>
        \`;
        questList.appendChild(questItem);
        
        // Add complete button handler
        const completeButton = questItem.querySelector('.complete-quest');
        completeButton.addEventListener('click', function() {
          completeQuest(questName);
        });
      }
    }
  }
  
  function completeQuest(questName) {
    const quest = quests.find(q => q.name === questName);
    if (quest && !questStatus[questName]) {
      console.log(\`Completing quest: \${questName}\`);
      questStatus[questName] = true;
      
      alert(\`Quest completed: \${questName}\\n\\nReward: \${quest.reward || 'Experience'}\`);
      
      // Update UI
      const questItem = document.getElementById(\`quest-\${questName.toLowerCase().replace(/\\s+/g, '-')}\`);
      if (questItem) {
        questItem.classList.add('completed');
        const completeButton = questItem.querySelector('.complete-quest');
        if (completeButton) {
          completeButton.disabled = true;
          completeButton.textContent = 'Completed';
        }
      }
      
      // Check if all quests are complete
      const allComplete = Object.values(questStatus).every(status => status === true);
      if (allComplete) {
        alert('Congratulations! All quests completed!');
      }
    }
  }
  ` : '// No quests defined'}
  
  function showEntityDetails() {
    const entity = ${JSON.stringify(seed.entity || { name: 'Unknown Entity', type: 'Unknown' }, null, 2)};
    
    alert(\`\${entity.name}\\n\\nType: \${entity.type}\${entity.description ? '\\n\\n' + entity.description : ''}\`);
  }
});`;
}

/**
 * Generate HTML for web project
 */
export function generateWebHTML(seed: SeedConfig): string {
  const entityName = seed.entity?.name || 'Mythic Entity';
  const envName = seed.environment?.name || 'Mythic Environment';
  const pageTitle = `${entityName} in ${envName}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="environment"></div>
  
  <div class="container">
    <header>
      <h1>${pageTitle}</h1>
      <p>A mythological experience generated by Equorn</p>
    </header>
    
    <main>
      <!-- Entity Section -->
      <section>
        <h2>The Entity</h2>
        <div class="entity-card" id="entity">
          <h3>${entityName}</h3>
          <p><strong>Type:</strong> ${seed.entity?.type || 'Unknown'}</p>
          ${seed.entity?.description ? `<p>${seed.entity.description}</p>` : ''}
          ${seed.entity?.attributes ? `
          <h4>Attributes</h4>
          <ul>
            ${Object.entries(seed.entity.attributes).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('\n            ')}
          </ul>
          ` : ''}
          ${seed.entity?.effects ? `<p><em>Effects: ${seed.entity.effects}</em></p>` : ''}
          ${seed.entity?.interactions ? `<p><em>Interactions available</em></p>` : ''}
        </div>
      </section>
      
      <!-- Environment Section -->
      <section>
        <h2>The Environment</h2>
        <div class="entity-card">
          <h3>${envName}</h3>
          <p><strong>Type:</strong> ${seed.environment?.type || 'Unknown'}</p>
          ${seed.environment?.description ? `<p>${seed.environment.description}</p>` : ''}
          ${seed.environment?.atmosphere ? `<p><em>Atmosphere: ${seed.environment.atmosphere}</em></p>` : ''}
        </div>
      </section>
      
      <!-- Quests Section -->
      ${seed.quests && seed.quests.length > 0 ? `
      <section>
        <h2>Quests</h2>
        <div class="entity-card">
          <h3>Available Quests</h3>
          <ul>
            ${seed.quests.map(quest => `
            <li>
              <h4>${quest.name}</h4>
              <p>${quest.objective}</p>
              <button data-quest-trigger="${quest.name}">Begin Quest</button>
            </li>`).join('\n            ')}
          </ul>
          
          <h3>Active Quests</h3>
          <div id="active-quests">
            <!-- Active quests will be added here -->
          </div>
        </div>
      </section>
      ` : ''}
    </main>
    
    <footer>
      <p>Generated with Equorn - The Myth Engine</p>
    </footer>
  </div>
  
  <script src="js/app.js"></script>
</body>
</html>`;
}

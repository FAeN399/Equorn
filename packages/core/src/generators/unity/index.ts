/**
 * Unity Generator module
 * Handles generating Unity projects from seed files
 */
import * as path from 'node:path';
import * as fs from 'fs-extra';
import { SeedConfig, EntityConfig, EnvironmentConfig } from '../../types.js';

/**
 * Generate a Unity project from a seed
 */
export async function generateUnityProject(
  seed: SeedConfig, 
  outputDir: string, 
  verbose?: boolean
): Promise<void> {
  if (verbose) {
    console.log('Generating Unity project...');
  }
  
  // Create project structure
  await fs.ensureDir(path.join(outputDir, 'Assets'));
  await fs.ensureDir(path.join(outputDir, 'Assets/Scripts'));
  await fs.ensureDir(path.join(outputDir, 'Assets/Scenes'));
  await fs.ensureDir(path.join(outputDir, 'Assets/Resources'));
  await fs.ensureDir(path.join(outputDir, 'ProjectSettings'));
  
  // Create entity script if entity exists
  if (seed.entity) {
    await fs.writeFile(
      path.join(outputDir, 'Assets/Scripts', `${seed.entity.name}.cs`),
      generateUnityEntityScript(seed.entity)
    );
  }
  
  // Create environment script if environment exists
  if (seed.environment) {
    await fs.writeFile(
      path.join(outputDir, 'Assets/Scripts', `${seed.environment.name}.cs`),
      generateUnityEnvironmentScript(seed.environment)
    );
  }
  
  // Create manager script
  await fs.writeFile(
    path.join(outputDir, 'Assets/Scripts', 'MythManager.cs'),
    generateUnityManagerScript(seed)
  );
  
  // Create README
  await fs.writeFile(
    path.join(outputDir, 'README.md'),
    `# ${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'} (Unity)
    
This is a generated Unity project for the ${seed.entity?.name || 'Entity'} myth.

## Getting Started

1. Open Unity Hub
2. Click "Add" and select this directory
3. Open the project in Unity
4. Open the Main scene in Assets/Scenes
    `
  );
  
  if (verbose) {
    console.log('Unity project generated successfully!');
  }
}

/**
 * Generate Unity entity script (C#)
 */
export function generateUnityEntityScript(entity: EntityConfig): string {
  return `using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// ${entity.name} entity class.
/// ${entity.description || ''}
/// </summary>
public class ${entity.name} : MonoBehaviour
{
    // Entity properties
    public string entityName = "${entity.name}";
    public string entityType = "${entity.type}";
    
    ${entity.attributes ? Object.entries(entity.attributes).map(([key, value]) => {
      const type = typeof value === 'number' ? 'float' : 
                   typeof value === 'boolean' ? 'bool' : 'string';
      return `public ${type} ${key} = ${type === 'string' ? `"${value}"` : value};`;
    }).join('\n    ') : '// No attributes defined'}
    
    // Movement speed
    public float speed = 5.0f;
    private Vector3 movement;
    
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log($"{entityName} of type {entityType} is ready!");
        ${entity.effects ? `// Effects: ${entity.effects}` : ''}
    }

    // Update is called once per frame
    void Update()
    {
        // Get input
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        
        // Calculate movement
        movement = new Vector3(horizontalInput, 0, verticalInput);
        
        // Move the entity
        transform.Translate(movement * speed * Time.deltaTime);
        
        ${entity.interactions ? `// Available Interactions: ${entity.interactions}` : ''}
    }
}`;
}

/**
 * Generate Unity environment script (C#)
 */
export function generateUnityEnvironmentScript(environment: EnvironmentConfig): string {
  return `using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// ${environment.name} environment class.
/// ${environment.description || ''}
/// </summary>
public class ${environment.name} : MonoBehaviour
{
    // Environment properties
    public string environmentName = "${environment.name}";
    public string environmentType = "${environment.type}";
    ${environment.atmosphere ? `// Atmosphere: ${environment.atmosphere}` : ''}
    
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log($"Environment {environmentName} of type {environmentType} is ready!");
        
        // Set up environment
        RenderSettings.ambientLight = new Color(0.2f, 0.2f, 0.2f);
        RenderSettings.fog = true;
        RenderSettings.fogColor = new Color(0.5f, 0.5f, 0.5f);
        RenderSettings.fogDensity = 0.01f;
    }

    // Update is called once per frame
    void Update()
    {
        // Environment behavior
    }
    
    // Apply environment effects to an entity
    public void ApplyEnvironmentEffects(GameObject entity)
    {
        Debug.Log($"Applying {environmentName} effects to {entity.name}");
        // Add environment-specific effects here
    }
}`;
}

/**
 * Generate Unity manager script (C#)
 */
export function generateUnityManagerScript(seed: SeedConfig): string {
  const className = seed.entity?.name || 'Entity';
  const environmentName = seed.environment?.name || 'Environment';

  return `using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// The MythManager coordinates all elements of the myth
/// </summary>
public class MythManager : MonoBehaviour
{
    // References
    public GameObject ${className.toLowerCase()}Prefab;
    public GameObject ${environmentName.toLowerCase()}Prefab;
    
    // Quests
    ${seed.quests && seed.quests.length > 0 ? `
    public class Quest
    {
        public string Name { get; set; }
        public string Objective { get; set; }
        public string Trigger { get; set; }
        public bool IsCompleted { get; set; }
        public string Reward { get; set; }
    }
    
    public List<Quest> quests = new List<Quest>();` : '// No quests defined'}
    
    // UI Elements
    public Text statusText;
    
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Myth Manager initialized");
        
        // Initialize environment
        var env = Instantiate(${environmentName.toLowerCase()}Prefab);
        env.name = "${environmentName}";
        
        // Initialize entity
        var entity = Instantiate(${className.toLowerCase()}Prefab);
        entity.name = "${className}";
        
        // Position the entity
        entity.transform.position = new Vector3(0, 1, 0);
        
        // Initialize quests
        ${seed.quests && seed.quests.length > 0 ? `
        // Add quests
        ${seed.quests.map(quest => `quests.Add(new Quest { 
            Name = "${quest.name}", 
            Objective = "${quest.objective}", 
            Trigger = "${quest.trigger}",
            IsCompleted = false,
            Reward = "${quest.reward || 'None'}"
        });`).join('\n        ')}
        
        UpdateQuestStatus();` : '// No quests to initialize'}
    }

    // Update is called once per frame
    void Update()
    {
        // Check for quest triggers, etc.
    }
    
    ${seed.quests && seed.quests.length > 0 ? `
    // Update quest status in UI
    void UpdateQuestStatus()
    {
        if (statusText != null)
        {
            string status = "Active Quests:\\n";
            foreach (var quest in quests)
            {
                status += $"• {quest.Name}: {(quest.IsCompleted ? "Completed" : quest.Objective)}\\n";
            }
            statusText.text = status;
        }
    }
    
    // Complete a quest
    public void CompleteQuest(string questName)
    {
        var quest = quests.Find(q => q.Name == questName);
        if (quest != null)
        {
            quest.IsCompleted = true;
            Debug.Log($"Quest completed: {questName}. Reward: {quest.Reward}");
            UpdateQuestStatus();
        }
    }` : '// No quest methods defined'}
}`;
}

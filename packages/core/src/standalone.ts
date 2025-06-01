/**
 * Standalone implementation of buildGuardian
 * This file provides a working implementation of the README section 4.2 example
 */
import { promises as fs } from 'fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import fse from 'fs-extra';

/**
 * Equorn Version - The current version of the Equorn engine
 * 
 * @constant {string} EQUORN_VERSION
 * @example
 * ```ts
 * import { EQUORN_VERSION } from '@equorn/core';
 * console.log(`Running Equorn version ${EQUORN_VERSION}`);
 * ```
 */
export const EQUORN_VERSION = "4.4.1";

/**
 * Options for the buildGuardian function
 * 
 * @interface BuildGuardianOptions
 */
export interface BuildGuardianOptions {
  /** 
   * Path to the seed YAML/JSON file 
   * @required
   * @example "./seeds/forest-guardian.yaml"
   */
  seedPath: string;
  
  /** 
   * Target platform for generation 
   * @default "godot"
   */
  target?: 'godot' | 'unity' | 'web' | 'docs';
  
  /** 
   * Output directory for generated files 
   * @default "./output"
   */
  outputDir?: string;
  
  /** 
   * Enable verbose logging to console 
   * @default false
   */
  verbose?: boolean;
}

/**
 * Result object returned by the buildGuardian function
 * 
 * @interface GenerationResult
 */
export interface GenerationResult {
  /** 
   * Absolute path to the generated project directory 
   */
  outputPath: string;
  
  /** 
   * List of paths to all generated files 
   */
  files: string[];
  
  /** 
   * Generation metadata and statistics 
   */
  metadata: {
    /** Target platform used for generation */
    target: string;
    /** Path to the source seed file */
    seedFile: string;
    /** Timestamp when generation completed */
    generatedAt: Date;
    /** Generation duration in milliseconds */
    duration: number;
  };
}

/**
 * Generates a complete project from a myth seed file
 *
 * The buildGuardian function transforms a YAML/JSON seed file into a fully functional
 * project for the specified target platform. For Godot targets, it creates a complete
 * project structure including scenes, scripts, and configuration files that can be opened
 * directly in the Godot editor.
 * 
 * @since 4.4.1
 * @param {BuildGuardianOptions} options - Configuration options
 * @returns {Promise<GenerationResult>} Object containing output path, generated files, and metadata
 *
 * @example
 * ```ts
 * import { buildGuardian } from '@equorn/core';
 * 
 * // Generate a Godot project from a seed file
 * const result = await buildGuardian({
 *   seedPath: './seeds/forest-guardian.yaml',
 *   target: 'godot',
 *   outputDir: './output',
 *   verbose: true
 * });
 * 
 * console.log(`Generated ${result.files.length} files at ${result.outputPath}`);
 * ```
 */
export async function buildGuardian(options: BuildGuardianOptions): Promise<GenerationResult> {
  const startTime = Date.now();
  const {
    seedPath,
    target = 'godot',
    outputDir = './output',
    verbose = false
  } = options;

  if (verbose) {
    console.log(`🌱 Parsing seed file: ${seedPath}`);
  }

  // 1. Validate seed file exists
  try {
    await fs.access(seedPath);
  } catch (error) {
    throw new Error(`Seed file not found: ${seedPath}`);
  }

  // 2. Parse the seed file
  const seedContent = await fs.readFile(seedPath, 'utf8');
  const seedData = yaml.load(seedContent) as any;

  if (verbose) {
    console.log(`🎯 Generating ${target} project...`);
  }

  // 3. Create output directory
  const targetOutputDir = path.join(outputDir, target);
  await fs.mkdir(targetOutputDir, { recursive: true });

  // 4. Generate based on target
  const generatedFiles: string[] = [];
  
  switch (target) {
    case 'godot':
      generatedFiles.push(...await generateGodotProject(seedData, targetOutputDir, verbose));
      break;
    case 'unity':
      generatedFiles.push(...await generateUnityProject(seedData, targetOutputDir, verbose));
      break;
    case 'web':
      generatedFiles.push(...await generateWebProject(seedData, targetOutputDir, verbose));
      break;
    case 'docs':
      generatedFiles.push(...await generateDocsProject(seedData, targetOutputDir, verbose));
      break;
    default:
      throw new Error(`Unsupported target: ${target}`);
  }

  const duration = Date.now() - startTime;

  if (verbose) {
    console.log(`✨ Generated ${generatedFiles.length} files in ${duration}ms`);
    console.log(`📁 Output location: ${targetOutputDir}`);
  }

  return {
    outputPath: targetOutputDir,
    files: generatedFiles,
    metadata: {
      target,
      seedFile: seedPath,
      generatedAt: new Date(),
      duration
    }
  };
}

/**
 * Generates a Guardian GDScript with abilities and behaviors based on seed data
 * @param entity The guardian entity from the seed file
 * @returns Formatted GDScript code as a string
 */
function generateGuardianScript(entity: any): string {
  const name = entity?.name || 'Unknown Guardian';
  const abilities = entity?.abilities || [];
  const description = entity?.description || 'A mysterious guardian of the forest';
  
  return `extends Node2D

# Guardian properties  
var guardian_name = "${name}"
var abilities = ${JSON.stringify(abilities)}
var description = "${description}"

# Called when the node enters the scene tree
func _ready():
	print("Guardian " + guardian_name + " is awakening...")
	for ability in abilities:
		print("Guardian can use: " + ability)

# Interact with the guardian
func interact():
	return description

# Handle guardian behavior (called by game systems)
func update_guardian():
	# Add guardian AI logic here
	pass

# Use a specific ability
func use_ability(ability_name: String):
	if ability_name in abilities:
		print("Guardian uses: " + ability_name)
		match ability_name:
			"nature_magic":
				cast_nature_spell()
			"root_entangle":
				entangle_enemies()
			"bark_armor":
				activate_defense()

func cast_nature_spell():
	print("${name} channels the power of the forest!")

func entangle_enemies():
	print("Roots burst from the ground to entangle foes!")
	
func activate_defense():
	print("Guardian's bark hardens into natural armor!")`;
}

/**
 * Generates a Godot project from the seed data
 * @param seedData Parsed seed data
 * @param outputDir Output directory
 * @param verbose Whether to log verbose output
 * @returns Array of generated file paths
 */
export async function generateGodotProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  const files: string[] = [];
  
  // Create basic Godot project structure
  await fs.mkdir(path.join(outputDir, 'scenes'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'scripts'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });

  if (verbose) console.log(`🎯 Generating godot project...`);

  // Generate project.godot
  const projectConfig = `; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="${seedData.world?.name || 'Whispering Woods'}"
config/features=PackedStringArray("4.4")
config/icon="res://icon.svg"
run/main_scene="res://scenes/main.tscn"

[rendering]

renderer/rendering_method="gl_compatibility"
environment/defaults/default_clear_color=Color(0.3, 0.3, 0.3, 1)`;
  
  const projectPath = path.join(outputDir, 'project.godot');
  await fs.writeFile(projectPath, projectConfig);
  files.push(projectPath);

  // Generate main scene with unique ID for reliable imports
  const sceneId = Math.random().toString(36).substring(2, 10);
  const mainScene = `[gd_scene load_steps=2 format=3 uid="uid://c${sceneId}"]

[ext_resource type="Script" path="res://scripts/guardian.gd" id="1_xf2q8"]

[node name="Main" type="Node2D"]

[node name="Label" type="Label" parent="."]
offset_left = 32.0
offset_top = 32.0
offset_right = 432.0
offset_bottom = 82.0
text = "${seedData.world?.name || 'Whispering Woods'} - Generated by Equorn v4.4.1"

[node name="Guardian" type="Node2D" parent="."]
position = Vector2(512, 300)
script = ExtResource("1_xf2q8")
`;

  const scenePath = path.join(outputDir, 'scenes', 'main.tscn');
  await fs.writeFile(scenePath, mainScene);
  files.push(scenePath);

  // Generate guardian script based on the seed data
  const guardianEntity = seedData.entities?.find((entity: any) => entity.type === 'guardian');
  const guardianScript = generateGuardianScript(guardianEntity);

  const scriptPath = path.join(outputDir, 'scripts', 'guardian.gd');
  await fs.writeFile(scriptPath, guardianScript);
  files.push(scriptPath);
  
  // Create a Godot icon.svg file
  const iconContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="128" height="128" rx="16" fill="#478CBF"/>
<path d="M64 24C42.109 24 24 42.109 24 64C24 85.891 42.109 104 64 104C85.891 104 104 85.891 104 64C104 42.109 85.891 24 64 24Z" fill="white"/>
<path d="M58.708 40C45.849 40 40 54.125 40 64C40 73.875 45.849 88 58.708 88H75C85 88 88 78 88 64C88 50 85 40 75 40H58.708Z" fill="#478CBF"/>
<ellipse cx="58.5" cy="58" rx="6.5" ry="6" fill="white"/>
</svg>`;
  
  const iconPath = path.join(outputDir, 'icon.svg');
  await fs.writeFile(iconPath, iconContent);
  files.push(iconPath);

  // Create default_env.tres file
  const envContent = `[gd_resource type="Environment" format=3]

[resource]
background_mode = 2
sky_horizon_color = Color(0.64625, 0.65575, 0.67075, 1)
tonemap_mode = 2
glow_enabled = true`;
  
  const envPath = path.join(outputDir, 'default_env.tres');
  await fs.writeFile(envPath, envContent);
  files.push(envPath);

  // Create a README for the generated project
  const readmePath = path.join(outputDir, 'README.md');
  const readmeContent = `# ${seedData.world?.name || 'Whispering Woods'}

This is a generated Godot 4.4.1 project for the ${seedData.world?.name || 'Whispering Woods'} myth.

## Getting Started

1. Open Godot Engine 4.4.1
2. Click "Import"
3. Navigate to this directory and select the project.godot file
4. Click "Import & Edit"

## About This Project

${seedData.world?.description || 'A generated mythic world'}

### Guardian: ${guardianEntity?.name || 'Unknown Guardian'}
${guardianEntity?.description || 'A mysterious guardian of this realm.'}

---
Generated by Equorn v4.4.1 on ${new Date().toLocaleDateString()}`;
  
  await fs.writeFile(readmePath, readmeContent);
  files.push(readmePath);

  if (verbose) {
    console.log(`📦 Generated Godot project with ${files.length} files`);
  }

  return files;
}

export async function generateUnityProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  const files: string[] = [];
  
  // Create Unity project structure
  await fs.mkdir(path.join(outputDir, 'Assets', 'Scripts'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'Assets', 'Scenes'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'Assets', 'Prefabs'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'ProjectSettings'), { recursive: true });

  if (verbose) {
    console.log('🛠️ Generating Unity project...');
  }

  // Generate ProjectSettings/ProjectVersion.txt
  const projectVersionPath = path.join(outputDir, 'ProjectSettings', 'ProjectVersion.txt');
  await fs.writeFile(projectVersionPath, 'targetUnityVersion: 2023.3.0f1\n');
  files.push(projectVersionPath);

  // Generate main Guardian script
  const guardianEntity = seedData.entities?.find((entity: any) => entity.type === 'guardian');
  const guardianName = guardianEntity?.name || 'Guardian';
  const abilities = guardianEntity?.abilities || ['basic_ability'];
  
  const guardianScript = `using UnityEngine;
using System.Collections.Generic;

public class ${guardianName.replace(/\\s+/g, '')} : MonoBehaviour
{
    [SerializeField] private string guardianName = "${guardianName}";
    [SerializeField] private string description = "${guardianEntity?.description || 'A mysterious guardian'}";
    [SerializeField] private List<string> abilities = new List<string> { ${abilities.map((a: string) => `"${a}"`).join(', ')} };

    void Start()
    {
        Debug.Log($"Guardian {guardianName} is awakening...");
        foreach (string ability in abilities)
        {
            Debug.Log($"Guardian can use: {ability}");
        }
    }

    public void Interact()
    {
        Debug.Log(description);
    }

    public void UseAbility(string abilityName)
    {
        if (abilities.Contains(abilityName))
        {
            Debug.Log($"Guardian uses: {abilityName}");
            
            switch (abilityName)
            {
                case "nature_magic":
                    CastNatureSpell();
                    break;
                case "root_entangle":
                    EntangleEnemies();
                    break;
                case "bark_armor":
                    ActivateDefense();
                    break;
                default:
                    Debug.Log($"{guardianName} uses {abilityName}!");
                    break;
            }
        }
        else
        {
            Debug.Log($"{guardianName} doesn't know how to use {abilityName}");
        }
    }

    private void CastNatureSpell()
    {
        Debug.Log($"{guardianName} channels the power of the forest!");
    }

    private void EntangleEnemies()
    {
        Debug.Log("Roots burst from the ground to entangle foes!");
    }

    private void ActivateDefense()
    {
        Debug.Log("Guardian's bark hardens into natural armor!");
    }
}`;

  const scriptPath = path.join(outputDir, 'Assets', 'Scripts', `${guardianName.replace(/\\s+/g, '')}.cs`);
  await fs.writeFile(scriptPath, guardianScript);
  files.push(scriptPath);

  // Generate a basic scene
  const sceneGuid = generateGUID();
  const scriptGuid = generateGUID();
  
  const sceneContent = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!29 &1
OcclusionCullingSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 2
  m_OcclusionBakeSettings:
    smallestOccluder: 5
    smallestHole: 0.25
    backfaceThreshold: 100
  m_SceneGUID: ${sceneGuid}
  m_OcclusionCullingData: {fileID: 0}
--- !u!104 &2
RenderSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 9
  m_Fog: 0
  m_FogColor: {r: 0.5, g: 0.5, b: 0.5, a: 1}
  m_FogMode: 3
  m_FogDensity: 0.01
  m_LinearFogStart: 0
  m_LinearFogEnd: 300
  m_AmbientSkyColor: {r: 0.212, g: 0.227, b: 0.259, a: 1}
  m_AmbientEquatorColor: {r: 0.114, g: 0.125, b: 0.133, a: 1}
  m_AmbientGroundColor: {r: 0.047, g: 0.043, b: 0.035, a: 1}
  m_AmbientIntensity: 1
  m_AmbientMode: 3
  m_SubtractiveShadowColor: {r: 0.42, g: 0.478, b: 0.627, a: 1}
--- !u!1 &${Math.floor(Math.random() * 999999999)}
GameObject:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  serializedVersion: 6
  m_Component:
  - component: {fileID: ${Math.floor(Math.random() * 999999999)}}
  - component: {fileID: ${Math.floor(Math.random() * 999999999)}}
  m_Layer: 0
  m_Name: ${guardianName}
  m_TagString: Untagged
  m_Icon: {fileID: 0}
  m_NavMeshLayer: 0
  m_StaticEditorFlags: 0
  m_IsActive: 1`;

  const scenePath = path.join(outputDir, 'Assets', 'Scenes', `${seedData.world?.name || 'Main'}.unity`);
  await fs.writeFile(scenePath, sceneContent);
  files.push(scenePath);

  // Generate README for Unity project
  const readmePath = path.join(outputDir, 'README.md');
  const readmeContent = `# ${seedData.world?.name || 'Unity Project'} - Generated by Equorn

This Unity project was generated from a myth seed file.

## Getting Started

1. Open Unity Hub
2. Click "Add" and select this folder
3. Open the project
4. Open the scene in Assets/Scenes/
5. Press Play to test the Guardian script

## Generated Components

- **Guardian Script**: \`Assets/Scripts/${guardianName.replace(/\\s+/g, '')}.cs\`
- **Main Scene**: \`Assets/Scenes/${seedData.world?.name || 'Main'}.unity\`

## Guardian: ${guardianName}
${guardianEntity?.description || 'A guardian of this realm.'}

**Abilities**: ${abilities.join(', ')}

---
Generated by Equorn v4.4.1 on ${new Date().toLocaleDateString()}`;
  
  await fs.writeFile(readmePath, readmeContent);
  files.push(readmePath);

  if (verbose) {
    console.log(`🛠️ Generated Unity project with ${files.length} files`);
  }

  return files;
}

// Helper function to generate Unity-style GUIDs
function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c: string) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function generateWebProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  const files: string[] = [];
  
  // Create basic web project structure
  await fs.mkdir(path.join(outputDir, 'css'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'js'), { recursive: true });
  await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });

  const worldName = seedData.world?.name || 'Generated World';
  const worldDescription = seedData.world?.description || 'A mystical realm generated by Equorn';
  const guardianEntity = seedData.entities?.find((entity: any) => entity.type === 'guardian');
  const guardianName = guardianEntity?.name || 'Guardian';
  const guardianDescription = guardianEntity?.description || 'A mysterious guardian';
  const abilities = guardianEntity?.abilities || [];

  // Generate index.html
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${worldName} - Generated by Equorn</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="cosmic-bg">
        <div class="stars"></div>
        <div class="container">
            <header class="hero">
                <h1 class="title">${worldName}</h1>
                <p class="subtitle">${worldDescription}</p>
                <div class="generated-badge">Generated by Equorn v4.4.1</div>
            </header>

            <main class="content">
                <section class="guardian-card">
                    <h2 class="guardian-name">${guardianName}</h2>
                    <p class="guardian-description">${guardianDescription}</p>
                    
                    ${abilities.length > 0 ? `
                    <div class="abilities">
                        <h3>Abilities</h3>
                        <ul class="ability-list">
                            ${abilities.map((ability: string) => `<li class="ability-item">${ability.replace(/_/g, ' ').replace(/\\b\\w/g, (l: string) => l.toUpperCase())}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <button class="interact-btn" onclick="interactWithGuardian()">
                        Interact with ${guardianName}
                    </button>
                </section>

                ${seedData.locations ? `
                <section class="locations">
                    <h2>Locations</h2>
                    <div class="location-grid">
                        ${seedData.locations.map((location: any) => `
                        <div class="location-card">
                            <h3>${location.name}</h3>
                            <p>${location.description}</p>
                        </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
            </main>

            <footer class="footer">
                <p>Generated on ${new Date().toLocaleDateString()} • Powered by Equorn Myth Engine</p>
            </footer>
        </div>
    </div>
    <script src="js/app.js"></script>
</body>
</html>`;

  const htmlPath = path.join(outputDir, 'index.html');
  await fs.writeFile(htmlPath, htmlContent);
  files.push(htmlPath);

  // Generate CSS with cosmic theme
  const cssContent = `/* Cosmic Theme Styling for Equorn Generated Web Project */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #0a0a0a;
    color: #e0e0e0;
    line-height: 1.6;
    overflow-x: hidden;
}

.cosmic-bg {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    position: relative;
}

.stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
        radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: sparkle 20s linear infinite;
    z-index: 1;
}

@keyframes sparkle {
    from { transform: translateX(0); }
    to { transform: translateX(-200px); }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 2;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 3rem;
}

.title {
    font-size: 3.5rem;
    font-weight: bold;
    background: linear-gradient(45deg, #64b5f6, #42a5f5, #1e88e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
}

.subtitle {
    font-size: 1.3rem;
    color: #b0b0b0;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.generated-badge {
    display: inline-block;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
}

.content {
    display: grid;
    gap: 2rem;
}

.guardian-card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.guardian-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(100, 181, 246, 0.2);
}

.guardian-name {
    font-size: 2rem;
    color: #64b5f6;
    margin-bottom: 1rem;
    text-align: center;
}

.guardian-description {
    font-size: 1.1rem;
    color: #d0d0d0;
    margin-bottom: 2rem;
    text-align: center;
}

.abilities {
    margin-bottom: 2rem;
}

.abilities h3 {
    color: #42a5f5;
    margin-bottom: 1rem;
    text-align: center;
}

.ability-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.ability-item {
    background: linear-gradient(45deg, #1e88e5, #1976d2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.interact-btn {
    display: block;
    width: 200px;
    margin: 0 auto;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.interact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.locations {
    margin-top: 2rem;
}

.locations h2 {
    color: #64b5f6;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
}

.location-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.location-card {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.location-card:hover {
    transform: translateY(-3px);
}

.location-card h3 {
    color: #42a5f5;
    margin-bottom: 0.5rem;
}

.footer {
    text-align: center;
    margin-top: 4rem;
    padding: 2rem;
    color: #888;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .title {
        font-size: 2.5rem;
    }
    
    .container {
        padding: 1rem;
    }
    
    .hero {
        padding: 2rem 1rem;
    }
}`;

  const cssPath = path.join(outputDir, 'css', 'style.css');
  await fs.writeFile(cssPath, cssContent);
  files.push(cssPath);

  // Generate JavaScript for interactivity
  const jsContent = `// Interactive features for Equorn generated web project

// Guardian interaction system
function interactWithGuardian() {
    const responses = [
        "${guardianDescription}",
        "The guardian watches you with ancient eyes.",
        "You sense great power emanating from this being.",
        "The guardian nods in acknowledgment of your presence."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showMessage(randomResponse);
    
    // Add some visual effects
    createSparkleEffect();
}

// Message display system
function showMessage(message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message popup
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-popup';
    messageDiv.innerHTML = \`
        <div class="message-content">
            <p>\${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    \`;
    
    // Add styles
    messageDiv.style.cssText = \`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #64b5f6;
        border-radius: 15px;
        padding: 2rem;
        z-index: 1000;
        max-width: 400px;
        text-align: center;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease;
    \`;
    
    const messageContent = messageDiv.querySelector('.message-content');
    messageContent.style.cssText = \`
        color: #e0e0e0;
    \`;
    
    const closeButton = messageDiv.querySelector('button');
    closeButton.style.cssText = \`
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        margin-top: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease;
    \`;
    
    closeButton.onmouseover = () => closeButton.style.transform = 'scale(1.05)';
    closeButton.onmouseout = () => closeButton.style.transform = 'scale(1)';
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Visual effects
function createSparkleEffect() {
    const guardianCard = document.querySelector('.guardian-card');
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = \`
            position: absolute;
            width: 4px;
            height: 4px;
            background: #64b5f6;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkleFloat 2s ease-out forwards;
        \`;
        
        const rect = guardianCard.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = \`
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes sparkleFloat {
        0% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
        }
        100% { 
            opacity: 0; 
            transform: translateY(-50px) scale(0); 
        }
    }
\`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('${worldName} - Generated by Equorn v4.4.1');
    console.log('Guardian: ${guardianName}');
    ${abilities.length > 0 ? `console.log('Abilities: ${abilities.join(', ')}');` : ''}
    
    // Add subtle animation to cards
    const cards = document.querySelectorAll('.guardian-card, .location-card');
    cards.forEach((card, index) => {
        card.style.animation = \`fadeIn 0.6s ease \${index * 0.1}s both\`;
    });
});`;

  const jsPath = path.join(outputDir, 'js', 'app.js');
  await fs.writeFile(jsPath, jsContent);
  files.push(jsPath);

  // Generate README for web project
  const readmePath = path.join(outputDir, 'README.md');
  const readmeContent = `# ${worldName} - Web Project

This interactive web presentation was generated from a myth seed file using Equorn v4.4.1.

## Getting Started

1. Open \`index.html\` in a web browser
2. Interact with the guardian and explore the world
3. Customize the styling in \`css/style.css\`
4. Add more interactivity in \`js/app.js\`

## Features

- **Cosmic Theme**: Beautiful space-inspired design
- **Interactive Guardian**: Click to interact with ${guardianName}
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Engaging visual effects

## Guardian: ${guardianName}
${guardianDescription}

${abilities.length > 0 ? `**Abilities**: ${abilities.join(', ')}` : ''}

## Project Structure

\`\`\`
web/
├── index.html          # Main page
├── css/
│   └── style.css      # Cosmic theme styling
├── js/
│   └── app.js         # Interactive features
└── assets/            # Additional resources
\`\`\`

---
Generated by Equorn v4.4.1 on ${new Date().toLocaleDateString()}`;
  
  await fs.writeFile(readmePath, readmeContent);
  files.push(readmePath);

  if (verbose) {
    console.log(`🌐 Generated web project with ${files.length} files`);
  }

  return files;
}

export async function generateDocsProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  const files: string[] = [];
  
  // Create docs project structure
  await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });

  const worldName = seedData.world?.name || 'Generated World';
  const worldDescription = seedData.world?.description || 'A mystical realm generated by Equorn';
  const guardianEntity = seedData.entities?.find((entity: any) => entity.type === 'guardian');
  const allEntities = seedData.entities || [];
  const locations = seedData.locations || [];
  const interactions = seedData.interactions || [];

  // Generate comprehensive README.md
  const readmeContent = `# ${worldName}

${worldDescription}

*Generated by Equorn v4.4.1 on ${new Date().toLocaleDateString()}*

## Table of Contents

- [Overview](#overview)
- [Entities](#entities)
- [Locations](#locations)
- [Interactions](#interactions)
- [Implementation Notes](#implementation-notes)

## Overview

This documentation describes the mythic world of **${worldName}**, a realm crafted from structured narrative blueprints using the Equorn myth-engine.

### World Properties

- **Name**: ${worldName}
- **Theme**: ${seedData.world?.theme || 'Not specified'}
- **Description**: ${worldDescription}

## Entities

${allEntities.length > 0 ? allEntities.map((entity: any) => `
### ${entity.name || 'Unnamed Entity'}

**Type**: ${entity.type || 'Unknown'}  
**Location**: ${entity.location || 'Unspecified'}

${entity.description || 'No description available.'}

${entity.abilities && entity.abilities.length > 0 ? `
**Abilities**:
${entity.abilities.map((ability: string) => `- ${ability.replace(/_/g, ' ').replace(/\\b\\w/g, (l: string) => l.toUpperCase())}`).join('\\n')}
` : ''}

${entity.attributes ? `
**Attributes**:
${Object.entries(entity.attributes).map(([key, value]) => `- **${key}**: ${value}`).join('\\n')}
` : ''}
`).join('\\n---\\n') : 'No entities defined in this world.'}

## Locations

${locations.length > 0 ? locations.map((location: any) => `
### ${location.name}

${location.description || 'No description available.'}

${location.connections && location.connections.length > 0 ? `
**Connected to**: ${location.connections.join(', ')}
` : ''}

${location.features && location.features.length > 0 ? `
**Features**:
${location.features.map((feature: any) => `- ${typeof feature === 'string' ? feature : Object.entries(feature).map(([k, v]) => `${k}: ${v}`).join(', ')}`).join('\\n')}
` : ''}
`).join('\\n---\\n') : 'No locations defined in this world.'}

## Interactions

${interactions.length > 0 ? interactions.map((interaction: any) => `
### ${interaction.trigger || 'Unnamed Interaction'}

**Type**: ${interaction.type || 'Unknown'}

${interaction.responses && interaction.responses.length > 0 ? `
**Possible Responses**:
${interaction.responses.map((response: string) => `- "${response}"`).join('\\n')}
` : ''}

${interaction.conditions ? `
**Conditions**: ${interaction.conditions}
` : ''}
`).join('\\n---\\n') : 'No interactions defined in this world.'}

## Implementation Notes

### For Game Developers

This world can be implemented in various game engines:

- **Godot**: Use the generated GDScript files for rapid prototyping
- **Unity**: Adapt the entity system using MonoBehaviour components  
- **Web**: Create interactive experiences with HTML5 and JavaScript
- **Custom Engine**: Use this documentation as a design reference

### Entity System

The entities in this world follow a component-based architecture:

\`\`\`
Entity {
  name: string
  type: string
  location: string
  abilities: string[]
  attributes: object
}
\`\`\`

### Location Graph

${locations.length > 0 ? `
The world consists of ${locations.length} interconnected location${locations.length === 1 ? '' : 's'}:

\`\`\`
${locations.map((loc: any) => `${loc.name}${loc.connections ? ` -> [${loc.connections.join(', ')}]` : ''}`).join('\\n')}
\`\`\`
` : 'No location graph available.'}

### Narrative Hooks

${interactions.length > 0 ? `
This world provides ${interactions.length} interaction point${interactions.length === 1 ? '' : 's'} for player engagement:

${interactions.map((interaction: any, index: number) => `${index + 1}. **${interaction.trigger}** (${interaction.type})`).join('\\n')}
` : 'No narrative hooks defined.'}

## Technical Specifications

- **Generated by**: Equorn Myth-Engine v4.4.1
- **Source Format**: YAML seed file
- **Target Platforms**: Godot, Unity, Web, Documentation
- **Entity Count**: ${allEntities.length}
- **Location Count**: ${locations.length}
- **Interaction Count**: ${interactions.length}

---

*This documentation was automatically generated from structured narrative data. For more information about the Equorn myth-engine, visit the project repository.*`;

  const readmePath = path.join(outputDir, 'README.md');
  await fs.writeFile(readmePath, readmeContent);
  files.push(readmePath);

  // Generate HTML presentation
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${worldName} - Documentation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .title {
            font-size: 3rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            font-size: 1.2rem;
            color: #7f8c8d;
            margin-bottom: 1rem;
        }
        
        .badge {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .section {
            background: white;
            margin-bottom: 2rem;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .section h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .entity-card, .location-card {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 0 10px 10px 0;
        }
        
        .entity-card h3, .location-card h3 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .abilities {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .ability {
            background: #3498db;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.9rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .stat-card {
            background: #ecf0f1;
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #3498db;
        }
        
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .toc {
            background: #ecf0f1;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        
        .toc li {
            margin-bottom: 0.5rem;
        }
        
        .toc a {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
        }
        
        .toc a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${worldName}</h1>
        <p class="subtitle">${worldDescription}</p>
        <div class="badge">Generated by Equorn v4.4.1</div>
    </div>

    <div class="toc">
        <h3>Table of Contents</h3>
        <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#entities">Entities (${allEntities.length})</a></li>
            <li><a href="#locations">Locations (${locations.length})</a></li>
            <li><a href="#interactions">Interactions (${interactions.length})</a></li>
        </ul>
    </div>

    <div class="section" id="overview">
        <h2>Overview</h2>
        <p>This documentation describes the mythic world of <strong>${worldName}</strong>, a realm crafted from structured narrative blueprints using the Equorn myth-engine.</p>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${allEntities.length}</div>
                <div class="stat-label">Entities</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${locations.length}</div>
                <div class="stat-label">Locations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${interactions.length}</div>
                <div class="stat-label">Interactions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${seedData.world?.theme || 'Custom'}</div>
                <div class="stat-label">Theme</div>
            </div>
        </div>
    </div>

    <div class="section" id="entities">
        <h2>Entities</h2>
        ${allEntities.length > 0 ? allEntities.map((entity: any) => `
        <div class="entity-card">
            <h3>${entity.name || 'Unnamed Entity'}</h3>
            <p><strong>Type:</strong> ${entity.type || 'Unknown'} | <strong>Location:</strong> ${entity.location || 'Unspecified'}</p>
            <p>${entity.description || 'No description available.'}</p>
            ${entity.abilities && entity.abilities.length > 0 ? `
            <div class="abilities">
                ${entity.abilities.map((ability: string) => `<span class="ability">${ability.replace(/_/g, ' ').replace(/\\b\\w/g, (l: string) => l.toUpperCase())}</span>`).join('')}
            </div>
            ` : ''}
        </div>
        `).join('') : '<p>No entities defined in this world.</p>'}
    </div>

    <div class="section" id="locations">
        <h2>Locations</h2>
        ${locations.length > 0 ? locations.map((location: any) => `
        <div class="location-card">
            <h3>${location.name}</h3>
            <p>${location.description || 'No description available.'}</p>
            ${location.connections && location.connections.length > 0 ? `
            <p><strong>Connected to:</strong> ${location.connections.join(', ')}</p>
            ` : ''}
        </div>
        `).join('') : '<p>No locations defined in this world.</p>'}
    </div>

    <div class="section" id="interactions">
        <h2>Interactions</h2>
        ${interactions.length > 0 ? interactions.map((interaction: any) => `
        <div class="entity-card">
            <h3>${interaction.trigger || 'Unnamed Interaction'}</h3>
            <p><strong>Type:</strong> ${interaction.type || 'Unknown'}</p>
            ${interaction.responses && interaction.responses.length > 0 ? `
            <p><strong>Responses:</strong></p>
            <ul>
                ${interaction.responses.map((response: string) => `<li>"${response}"</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('') : '<p>No interactions defined in this world.</p>'}
    </div>

    <div class="section">
        <h2>Technical Information</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p><strong>Engine:</strong> Equorn Myth-Engine v4.4.1</p>
        <p><strong>Format:</strong> YAML seed file</p>
        <p><strong>Targets:</strong> Godot, Unity, Web, Documentation</p>
    </div>
</body>
</html>`;

  const htmlPath = path.join(outputDir, 'index.html');
  await fs.writeFile(htmlPath, htmlContent);
  files.push(htmlPath);

  // Generate a simple entity reference JSON
  const entityRefContent = JSON.stringify({
    world: {
      name: worldName,
      description: worldDescription,
      theme: seedData.world?.theme || 'custom'
    },
    entities: allEntities,
    locations: locations,
    interactions: interactions,
    metadata: {
      generatedBy: 'Equorn v4.4.1',
      generatedAt: new Date().toISOString(),
      entityCount: allEntities.length,
      locationCount: locations.length,
      interactionCount: interactions.length
    }
  }, null, 2);

  const jsonPath = path.join(outputDir, 'assets', 'world-data.json');
  await fs.writeFile(jsonPath, entityRefContent);
  files.push(jsonPath);

  if (verbose) {
    console.log(`📚 Generated documentation with ${files.length} files`);
  }

  return files;
}

export { spawnUnityGenerator } from './generators/unity/index.js';

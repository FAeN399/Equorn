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

async function generateUnityProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  // Placeholder - implement Unity-specific generation
  if (verbose) {
    console.log('🔧 Unity generator not yet implemented');
  }
  return [];
}

async function generateWebProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  // Placeholder - implement web-specific generation
  if (verbose) {
    console.log('🌐 Web generator not yet implemented');
  }
  return [];
}

async function generateDocsProject(seedData: any, outputDir: string, verbose: boolean): Promise<string[]> {
  // Placeholder - implement docs-specific generation
  if (verbose) {
    console.log('📚 Docs generator not yet implemented');
  }
  return [];
}

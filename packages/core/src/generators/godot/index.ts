/**
 * Godot Generator module
 * Handles generating Godot 4.x projects from seed files
 */
import * as path from 'node:path';
import * as fs from 'fs-extra';
import { SeedConfig, EntityConfig, EnvironmentConfig } from '../../types.js';

/**
 * Generate a Godot project from a seed
 */
export async function generateGodotProject(
  seed: SeedConfig, 
  outputDir: string, 
  verbose?: boolean
): Promise<void> {
  if (verbose) {
    console.log('Generating Godot project...');
  }
  
  // Create project structure
  await fs.ensureDir(path.join(outputDir, 'scenes'));
  await fs.ensureDir(path.join(outputDir, 'scripts'));
  await fs.ensureDir(path.join(outputDir, 'assets'));
  
  // Create project.godot file
  await fs.writeFile(
    path.join(outputDir, 'project.godot'),
    generateGodotProjectConfig(seed)
  );
  
  // Create main scene
  await fs.writeFile(
    path.join(outputDir, 'scenes', 'Main.tscn'),
    generateGodotMainScene(seed)
  );
  
  // Create entity scripts and scenes if entity exists
  if (seed.entity) {
    await fs.writeFile(
      path.join(outputDir, 'scripts', `${seed.entity.name}.gd`),
      generateGodotEntityScript(seed.entity)
    );
  }
  
  // Create environment scenes if environment exists
  if (seed.environment) {
    await fs.writeFile(
      path.join(outputDir, 'scenes', `${seed.environment.name}.tscn`),
      generateGodotEnvironmentScene(seed.environment)
    );
  }
  
  // Create README
  await fs.writeFile(
    path.join(outputDir, 'README.md'),
    `# ${seed.entity?.name || 'Entity'} in ${seed.environment?.name || 'Environment'}
    
This is a generated Godot project for the ${seed.entity?.name || 'Entity'} myth.

## Getting Started

1. Open Godot Engine
2. Click "Import"
3. Navigate to this directory and select the project.godot file
4. Click "Import & Edit"
    `
  );
  
  if (verbose) {
    console.log('Godot project generated successfully!');
  }
}

/**
 * Generate Godot project configuration file content
 */
export function generateGodotProjectConfig(seed: SeedConfig): string {
  return `; Engine configuration file.
; Generated with Equorn
  
[application]
config/name="${seed.entity?.name || 'Mythic'} Journey"
run/main_scene="res://scenes/Main.tscn"
config/icon="res://assets/icon.png"

[rendering]
environment/default_environment="res://default_env.tres"
`;
}

/**
 * Generate Godot main scene file content
 */
export function generateGodotMainScene(seed: SeedConfig): string {
  return `[gd_scene load_steps=3 format=2]

[ext_resource path="res://scripts/${seed.entity?.name || 'Entity'}.gd" type="Script" id=1]
[ext_resource path="res://scenes/${seed.environment?.name || 'Environment'}.tscn" type="PackedScene" id=2]

[node name="Main" type="Node2D"]

[node name="${seed.entity?.name || 'Entity'}" type="KinematicBody2D" parent="."]
position = Vector2(512, 300)
script = ExtResource( 1 )

[node name="${seed.environment?.name || 'Environment'}" parent="." instance=ExtResource( 2 )]
`;
}

/**
 * Generate Godot entity script file content
 */
export function generateGodotEntityScript(entity: EntityConfig): string {
  return `extends KinematicBody2D

# ${entity.name} Entity Script
# Generated with Equorn

# Entity Properties
export var speed = 200
export var entity_name = "${entity.name}"
export var entity_type = "${entity.type}"

${entity.attributes ? Object.entries(entity.attributes).map(([key, value]) => `export var ${key} = ${JSON.stringify(value)}`).join('\n') : '# No attributes defined'}

${entity.description ? `# Description: ${entity.description}` : ''}

var velocity = Vector2()

func _ready():
	print("${entity.name} is ready!")

func _process(delta):
	# Handle input
	velocity = Vector2()
	if Input.is_action_pressed("ui_right"):
		velocity.x += 1
	if Input.is_action_pressed("ui_left"):
		velocity.x -= 1
	if Input.is_action_pressed("ui_down"):
		velocity.y += 1
	if Input.is_action_pressed("ui_up"):
		velocity.y -= 1
	
	# Normalize velocity and apply speed
	velocity = velocity.normalized() * speed
	
	# Move
	velocity = move_and_slide(velocity)
${entity.interactions ? `\n\t# Available Interactions: ${entity.interactions}` : ''}
`;
}

/**
 * Generate Godot environment scene file content
 */
export function generateGodotEnvironmentScene(environment: EnvironmentConfig): string {
  return `[gd_scene format=2]

[node name="${environment.name}" type="Node2D"]

[node name="Background" type="ColorRect" parent="."]
anchor_right = 1.0
anchor_bottom = 1.0
margin_right = 1024
margin_bottom = 600
color = Color(0.2, 0.2, 0.2, 1.0)

[node name="Label" type="Label" parent="."]
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
margin_left = 383.0
margin_top = 280.0
margin_right = 641.0
margin_bottom = 320.0
text = "${environment.name} - ${environment.type}"
align = 1
valign = 1
${environment.atmosphere ? `# Atmosphere: ${environment.atmosphere}` : ''}
`;
}

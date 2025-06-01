#!/usr/bin/env node
/**
 * Equorn CLI - Direct Implementation
 * A standalone CLI that implements core generation functionality directly
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { program } = require('commander');

// Simple colored output functions
const chalk = { 
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`
};

// Set up CLI metadata
program
  .name('equorn')
  .description('A generative myth-engine to bridge narrative design and playable prototypes')
  .version('4.4.1');

// Seed command
program
  .command('seed')
  .description('Generate a project from a seed file')
  .argument('<seedPath>', 'Path to the seed file (YAML or JSON)')
  .option('-t, --target <target>', 'Target platform (godot, unity, web, docs)', 'godot')
  .option('-o, --output <dir>', 'Output directory for generated files')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (seedFile, options) => {
    try {
      console.log(chalk.cyan('🌟 Equorn Myth-Engine v4.4.1 🌟'));
      console.log(chalk.cyan(`Converting myth seed to ${options.target.charAt(0).toUpperCase() + options.target.slice(1)} project...\n`));
      
      // Resolve the seed file path
      const seedPath = path.resolve(process.cwd(), seedFile);
      
      // Check if seed file exists
      if (!fs.existsSync(seedPath)) {
        throw new Error(`Seed file not found: ${seedPath}`);
      }
      
      // Determine output directory
      let outputDir = options.output || `output/${options.target}`;
      outputDir = path.resolve(process.cwd(), outputDir);
      
      console.log(chalk.green(`🌱 Parsing seed file: ${seedPath}`));
      
      // Measure execution time
      const startTime = Date.now();
      
      // Process the seed file directly
      const seedContent = fs.readFileSync(seedPath, 'utf8');
      let seedData;
      
      // Parse based on file extension
      if (seedPath.endsWith('.yaml') || seedPath.endsWith('.yml')) {
        seedData = yaml.load(seedContent);
      } else if (seedPath.endsWith('.json')) {
        seedData = JSON.parse(seedContent);
      } else {
        throw new Error('Unsupported seed file format. Use .yaml, .yml, or .json');
      }
      
      // Generate files based on target
      let generatedFiles = [];
      if (options.target === 'godot') {
        generatedFiles = await generateGodotProject(seedData, outputDir, options.verbose);
      } else {
        // Better error message for unsupported targets
        const targetList = ['godot', 'unity', 'web', 'docs'];
        if (targetList.includes(options.target)) {
          throw new Error(`The ${options.target} target is recognized but not yet implemented. Currently only 'godot' is available.`);
        } else {
          throw new Error(`Unknown target: '${options.target}'. Available targets are: ${targetList.join(', ')}`);
        }
      }
      
      const duration = Date.now() - startTime;
      
      // Display success message
      console.log(chalk.green(`\n✨ Generated ${generatedFiles.length} files in ${duration}ms`));
      console.log(chalk.blue(`📁 Output location: ${outputDir}\n`));
      
      console.log(chalk.green('✅ Generation complete!'));
      console.log(chalk.blue(`📁 Project location: ${outputDir}`));
      console.log(chalk.blue(`📝 Files created: ${generatedFiles.length}\n`));
      
      // List generated files
      if (generatedFiles.length > 0) {
        console.log('Generated files:');
        generatedFiles.forEach(file => {
          console.log(`  - ${file}`);
        });
        console.log();
      }
      
      // Show generation info
      console.log('Generation info:');
      console.log(`  - Target: ${options.target}`);
      console.log(`  - Seed: ${seedPath}`);
      console.log(`  - Time: ${new Date().toLocaleString()}`);
      console.log(`  - Duration: ${duration}ms\n`);
      
      // Show next steps based on target
      if (options.target === 'godot') {
        console.log(chalk.yellow('🎮 Open the project in Godot Engine 4.4.1 to explore!'));
        console.log(chalk.yellow('   Use: "File > Open Project" and select the output/godot folder'));
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      console.error(chalk.red('Generation failed. Please check your seed file and try again.'));
      process.exit(1);
    }
  });

// Initialize command
program
  .command('init')
  .description('Create a new seed file from a template')
  .argument('[name]', 'Name for the new seed (optional)')
  .option('-t, --template <template>', 'Template to use', 'guardian')
  .action((name, options) => {
    console.log(chalk.cyan(`📝 Creating new ${options.template} seed${name ? ` named "${name}"` : ''}...`));
    
    try {
      // Simple template implementation
      const templatePath = path.join(process.cwd(), 'seeds', 'forest-guardian.yaml');
      const seedContent = fs.readFileSync(templatePath, 'utf8');
      
      // Create output path
      const outputName = name ? `${name}.yaml` : `${options.template}-${Date.now()}.yaml`;
      const outputPath = path.join(process.cwd(), outputName);
      
      // Write the template
      fs.writeFileSync(outputPath, seedContent);
      
      console.log(chalk.green('✅ Seed file created successfully!'));
      console.log(chalk.blue(`📄 File location: ${outputPath}`));
      console.log();
      console.log('Next steps:');
      console.log(`  1. Edit ${outputName} to customize your world`);
      console.log(`  2. Run: node equorn-cli-direct.js seed ${outputName} to generate a project`);
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      console.error(chalk.red('Failed to create seed file.'));
      process.exit(1);
    }
  });

/**
 * Direct implementation of Godot project generation
 */
async function generateGodotProject(seedData, outputDir, verbose = false) {
  const files = [];
  const fs = require('fs');
  const path = require('path');
  const util = require('util');
  const writeFile = util.promisify(fs.writeFile);
  const mkdir = util.promisify(fs.mkdir);
  
  if (verbose) {
    console.log(`🛠️ Creating Godot project structure...`);
  }
  
  // Create expanded Godot project structure
  await mkdir(path.join(outputDir, 'scenes'), { recursive: true });
  await mkdir(path.join(outputDir, 'scenes', 'levels'), { recursive: true });
  await mkdir(path.join(outputDir, 'scenes', 'ui'), { recursive: true });
  await mkdir(path.join(outputDir, 'scenes', 'entities'), { recursive: true });
  await mkdir(path.join(outputDir, 'scripts'), { recursive: true });
  await mkdir(path.join(outputDir, 'scripts', 'entities'), { recursive: true });
  await mkdir(path.join(outputDir, 'scripts', 'ui'), { recursive: true });
  await mkdir(path.join(outputDir, 'scripts', 'autoload'), { recursive: true });
  await mkdir(path.join(outputDir, 'assets'), { recursive: true });
  await mkdir(path.join(outputDir, 'assets', 'images'), { recursive: true });
  await mkdir(path.join(outputDir, 'assets', 'fonts'), { recursive: true });
  await mkdir(path.join(outputDir, 'assets', 'audio'), { recursive: true });
  
  // Process world data
  const worldName = seedData.world?.name || 'Mythic World';
  const worldDescription = seedData.world?.description || 'A world of myth and wonder';
  
  // Process all entities
  const allEntities = seedData.entities || [];
  const guardian = allEntities.find(e => e.type === 'guardian') || {};
  // Ensure abilities is always defined and is an array
  const abilities = Array.isArray(guardian.abilities) && guardian.abilities.length > 0
    ? guardian.abilities
    : ["nature_magic", "root_binding", "forest_whisper", "animal_communication"];
  const npcs = allEntities.filter(e => e.type === 'npc' || e.type === 'character');
  const items = allEntities.filter(e => e.type === 'item');
  const locations = seedData.locations || [];
  
  if (verbose) {
    console.log(`📝 Generating project for world: ${worldName}`);
    console.log(`🧙 Guardian: ${guardian.name || 'None'}`);  
    console.log(`👥 NPCs/Characters: ${npcs.length}`);  
    console.log(`🏺 Items: ${items.length}`);  
    console.log(`🗺️ Locations: ${locations.length}`);  
  }
  
  // Generate Godot project file with autoload singletons and input mappings
  const projectConfig = `; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="${worldName}"
config/description="${worldDescription}"
config/version="1.0.0"
config/features=PackedStringArray("4.4", "GL Compatibility")
run/main_scene="res://scenes/main.tscn"
config/icon="res://icon.svg"

[autoload]

GameManager="*res://scripts/autoload/game_manager.gd"
DialogueManager="*res://scripts/autoload/dialogue_manager.gd"

[display]

window/size/viewport_width=1152
window/size/viewport_height=648
window/stretch/mode="canvas_items"

[input]

interact={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":69,"physical_keycode":0,"key_label":0,"unicode":101,"echo":false,"script":null)]}
pause={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":4194305,"physical_keycode":0,"key_label":0,"unicode":0,"echo":false,"script":null)]}
move_up={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":87,"physical_keycode":0,"key_label":0,"unicode":119,"echo":false,"script":null)]}
move_down={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":83,"physical_keycode":0,"key_label":0,"unicode":115,"echo":false,"script":null)]}
move_left={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":65,"physical_keycode":0,"key_label":0,"unicode":97,"echo":false,"script":null)]}
move_right={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":68,"physical_keycode":0,"key_label":0,"unicode":100,"echo":false,"script":null)]}
ability_1={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":49,"physical_keycode":0,"key_label":0,"unicode":49,"echo":false,"script":null)]}
ability_2={"deadzone":0.5,"events":[Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":50,"physical_keycode":0,"key_label":0,"unicode":50,"echo":false,"script":null)]}

[rendering]

renderer/rendering_method="gl_compatibility"
renderer/rendering_method.mobile="gl_compatibility"

[layer_names]

2d_physics/layer_1="World"
2d_physics/layer_2="Player"
2d_physics/layer_3="Entities"
2d_physics/layer_4="Items"
`;
  
  // Write project.godot
  const projectPath = path.join(outputDir, 'project.godot');
  await writeFile(projectPath, projectConfig);
  files.push(projectPath);
  
  // Generate game manager singleton
  const gameManagerScript = generateGameManagerScript(worldName, guardian, npcs, locations);
  const gameManagerPath = path.join(outputDir, 'scripts', 'autoload', 'game_manager.gd');
  await writeFile(gameManagerPath, gameManagerScript);
  files.push(gameManagerPath);
  
  // Generate dialogue manager singleton
  const dialogueManagerScript = generateDialogueManagerScript(npcs, guardian);
  const dialogueManagerPath = path.join(outputDir, 'scripts', 'autoload', 'dialogue_manager.gd');
  await writeFile(dialogueManagerPath, dialogueManagerScript);
  files.push(dialogueManagerPath);
  
  // Generate guardian script
  const guardianScript = generateGuardianScript(guardian);
  const guardianScriptPath = path.join(outputDir, 'scripts', 'guardian.gd');
  await writeFile(guardianScriptPath, guardianScript);
  files.push(guardianScriptPath);
  
  // Generate NPC scripts if any exist
  for (const npc of npcs) {
    const npcScript = generateNpcScript(npc);
    const npcName = npc.name.toLowerCase().replace(/\s+/g, '_');
    const npcScriptPath = path.join(outputDir, 'scripts', 'entities', `${npcName}.gd`);
    await writeFile(npcScriptPath, npcScript);
    files.push(npcScriptPath);
  }
  
  // Generate main scene with guardian and player
  const mainScene = `[gd_scene load_steps=16 format=3 uid="uid://bqox8pwcxlugd"]

[ext_resource type="Script" path="res://scripts/guardian.gd" id="1_lf82p"]
[ext_resource type="PackedScene" path="res://scenes/entities/player.tscn" id="2_nmrcd"]
[ext_resource type="PackedScene" path="res://scenes/ui/ability_button.tscn" id="3_v8ktu"]

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_gljv8"]
bg_color = Color(0.133333, 0.380392, 0.188235, 1)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.227451, 0.521569, 0.298039, 1)
corner_radius_top_left = 5
corner_radius_top_right = 5
corner_radius_bottom_right = 5
corner_radius_bottom_left = 5

[sub_resource type="LabelSettings" id="LabelSettings_0gsg7"]
font_size = 24
font_color = Color(0.898039, 0.984314, 0.905882, 1)
outline_size = 2
outline_color = Color(0.152941, 0.368627, 0.239216, 1)

[sub_resource type="LabelSettings" id="LabelSettings_hhjqn"]
font_size = 18
font_color = Color(0.917647, 1, 0.941176, 1)
outline_size = 1
outline_color = Color(0.184314, 0.368627, 0.270588, 1)

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_ylb6r"]
bg_color = Color(0.227451, 0.227451, 0.227451, 0.866667)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.294118, 0.603922, 0.368627, 1)
corner_radius_top_left = 8
corner_radius_top_right = 8
corner_radius_bottom_right = 8
corner_radius_bottom_left = 8

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_xmwj2"]
bg_color = Color(0.219608, 0.521569, 0.384314, 1)
border_width_left = 2
border_width_top = 2
border_width_right = 2
border_width_bottom = 2
border_color = Color(0.152941, 0.34902, 0.25098, 1)
corner_radius_top_left = 5
corner_radius_top_right = 5
corner_radius_bottom_right = 5
corner_radius_bottom_left = 5

[sub_resource type="CircleShape2D" id="CircleShape2D_n4vxn"]
radius = 32.0

[sub_resource type="CircleShape2D" id="CircleShape2D_jyrgd"]
radius = 150.0

[sub_resource type="Gradient" id="Gradient_h0vwk"]
colors = PackedColorArray(0.568627, 0.898039, 0.537255, 1, 0.533333, 0.823529, 0.596078, 0.501961)

[sub_resource type="GradientTexture2D" id="GradientTexture2D_23jy6"]
gradient = SubResource("Gradient_h0vwk")
width = 16
height = 16
fill = 1
fill_from = Vector2(0.5, 0.5)
fill_to = Vector2(1, 0.5)

[sub_resource type="ParticleProcessMaterial" id="ParticleProcessMaterial_8r7t3"]
emission_shape = 1
emission_sphere_radius = 32.0
particle_flag_disable_z = true
direction = Vector3(0, -1, 0)
spread = 180.0
gravity = Vector3(0, 0, 0)
initial_velocity_min = 50.0
initial_velocity_max = 80.0
orbital_velocity_min = 0.0
orbital_velocity_max = 0.0
angle_max = 360.0
scale_min = 0.5
scale_max = 1.5
color = Color(0.231373, 0.85098, 0.54902, 1)
color_ramp = SubResource("GradientTexture2D_23jy6")

[sub_resource type="LabelSettings" id="LabelSettings_cyk3j"]
font_size = 20
font_color = Color(0.901961, 0.980392, 0.901961, 1)
outline_size = 2
outline_color = Color(0.145098, 0.294118, 0.196078, 1)

[sub_resource type="LabelSettings" id="LabelSettings_d7uvt"]
font_size = 16

[node name="Main" type="Node2D"]

[node name="Background" type="ColorRect" parent="."]
offset_right = 1152.0
offset_bottom = 648.0
color = Color(0.133333, 0.380392, 0.188235, 1)

[node name="WorldElements" type="Node2D" parent="."]

[node name="Star1" type="Polygon2D" parent="WorldElements"]
position = Vector2(754, 96)
color = Color(0.988235, 0.941176, 0.368627, 1)
polygon = PackedVector2Array(0, -24, 8, -8, 24, -8, 12, 4, 16, 20, 0, 12, -16, 20, -12, 4, -24, -8, -8, -8)

[node name="Star2" type="Polygon2D" parent="WorldElements"]
position = Vector2(160, 501)
rotation = 0.523599
scale = Vector2(0.7, 0.7)
color = Color(0.988235, 0.941176, 0.368627, 1)
polygon = PackedVector2Array(0, -24, 8, -8, 24, -8, 12, 4, 16, 20, 0, 12, -16, 20, -12, 4, -24, -8, -8, -8)

[node name="Flower" type="Polygon2D" parent="WorldElements"]
position = Vector2(950, 500)
color = Color(0.980392, 0.494118, 0.717647, 1)
polygon = PackedVector2Array(0, -16, 8, -8, 16, -16, 8, 0, 16, 16, 0, 8, -16, 16, -8, 0, -16, -16, -8, -8)

[node name="Cloud" type="Polygon2D" parent="WorldElements"]
position = Vector2(300, 180)
color = Color(0.886275, 0.945098, 0.968627, 0.741176)
polygon = PackedVector2Array(-40, 0, -32, -16, -16, -24, 0, -24, 16, -16, 32, -16, 48, -8, 56, 8, 48, 24, 24, 32, 0, 32, -24, 24, -48, 16)

[node name="Guardian" type="Node2D" parent="."]
position = Vector2(576, 324)
script = ExtResource("1_lf82p")

[node name="GuardianSprite" type="Polygon2D" parent="Guardian"]
Position = Vector2(0, 0)
color = Color(0.219608, 0.65098, 0.368627, 1)
polygon = PackedVector2Array(0, -32, 24, -16, 24, 16, 0, 32, -24, 16, -24, -16)

[node name="CollisionShape2D" type="CollisionShape2D" parent="Guardian"]
shape = SubResource("CircleShape2D_n4vxn")

[node name="InteractionArea" type="Area2D" parent="Guardian"]

[node name="CollisionShape2D" type="CollisionShape2D" parent="Guardian/InteractionArea"]
shape = SubResource("CircleShape2D_jyrgd")

[node name="AbilityEffects" type="Node2D" parent="Guardian"]

[node name="NatureMagic" type="GPUParticles2D" parent="Guardian/AbilityEffects"]
emitting = false
amount = 32
process_material = SubResource("ParticleProcessMaterial_8r7t3")
lifetime = 2.0
one_shot = true
explode_flag = true

[node name="RootBinding" type="GPUParticles2D" parent="Guardian/AbilityEffects"]

emitting = false
amount = 24
process_material = SubResource("ParticleProcessMaterial_8r7t3")
lifetime = 1.5
one_shot = true
explode_flag = true

[node name="ForestWhisper" type="GPUParticles2D" parent="Guardian/AbilityEffects"]

emitting = false
amount = 16
process_material = SubResource("ParticleProcessMaterial_8r7t3")
lifetime = 2.0
one_shot = true
explode_flag = true

[node name="AnimalCommunication" type="GPUParticles2D" parent="Guardian/AbilityEffects"]
emitting = false
amount = 20
process_material = SubResource("ParticleProcessMaterial_8r7t3")
lifetime = 1.8
one_shot = true
explode_flag = true

[node name="Player" parent="." instance=ExtResource("2_nmrcd")]
position = Vector2(576, 400)

[node name="UI" type="CanvasLayer" parent="."]

[node name="TitlePanel" type="Panel" parent="UI"]
offset_left = 26.0
offset_top = 19.0
offset_right = 473.0
offset_bottom = 89.0
theme_override_styles/panel = SubResource("StyleBoxFlat_gljv8")

[node name="Title" type="Label" parent="UI/TitlePanel"]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -138.5
offset_top = -17.0
offset_right = 138.5
offset_bottom = 17.0
grow_horizontal = 2
grow_vertical = 2
text = "Forest Guardian Demo"
label_settings = SubResource("LabelSettings_0gsg7")

[node name="Description" type="Label" parent="UI"]
offset_left = 26.0
offset_top = 95.0
offset_right = 473.0
offset_bottom = 145.0
text = "Interact with the guardian and test their abilities"
label_settings = SubResource("LabelSettings_hhjqn")
horizontal_alignment = 1
vertical_alignment = 1
text_overrun_behavior = 3

[node name="AbilityButtons" type="VBoxContainer" parent="UI"]
offset_left = 26.0
offset_top = 145.0
offset_right = 256.0
offset_bottom = 500.0
theme_override_constants/separation = 10

[node name="NatureMagicButton" parent="UI/AbilityButtons" instance=ExtResource("3_v8ktu")]
layout_mode = 2
text = "Nature Magic"

[node name="RootBindingButton" parent="UI/AbilityButtons" instance=ExtResource("3_v8ktu")]
layout_mode = 2
text = "Root Binding"

[node name="ForestWhisperButton" parent="UI/AbilityButtons" instance=ExtResource("3_v8ktu")]
layout_mode = 2
text = "Forest Whisper"

[node name="AnimalCommunicationButton" parent="UI/AbilityButtons" instance=ExtResource("3_v8ktu")]
layout_mode = 2
text = "Animal Communication"

[node name="DialoguePanel" type="Panel" parent="UI"]
visible = false
anchors_preset = 7
anchor_left = 0.5
anchor_top = 1.0
anchor_right = 0.5
anchor_bottom = 1.0
offset_left = 276.0
offset_top = 448.0
offset_right = 1126.0
offset_bottom = 598.0
grow_horizontal = 2
grow_vertical = 0
theme_override_styles/panel = SubResource("StyleBoxFlat_ylb6r")

[node name="SpeakerName" type="Label" parent="UI/DialoguePanel"]
layout_mode = 0
offset_left = 20.0
offset_top = 10.0
offset_right = 200.0
offset_bottom = 45.0
text = "Forest Guardian:"
label_settings = SubResource("LabelSettings_cyk3j")

[node name="DialogueText" type="Label" parent="UI/DialoguePanel"]
layout_mode = 0
offset_left = 20.0
offset_top = 45.0
offset_right = 830.0
offset_bottom = 115.0
text = "I am the guardian of this forest. How may I assist you today?"
label_settings = SubResource("LabelSettings_d7uvt")
text_overrun_behavior = 3
autowrap_mode = 3

[node name="NextButton" type="Button" parent="UI/DialoguePanel"]
layout_mode = 1
anchors_preset = 3
anchor_left = 1.0
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = -100.0
offset_top = -40.0
offset_right = -20.0
offset_bottom = -15.0
grow_horizontal = 0
grow_vertical = 0
theme_override_styles/normal = SubResource("StyleBoxFlat_xmwj2")
text = "Next"

[node name="Instructions" type="Label" parent="UI"]
visible = false
offset_left = 276.0
offset_top = 380.0
offset_right = 576.0
offset_bottom = 430.0
text = "Press E to interact"
label_settings = SubResource("LabelSettings_hhjqn")
horizontal_alignment = 1
vertical_alignment = 1

[connection signal="area_entered" from="Guardian/InteractionArea" to="Guardian" method="_on_interaction_area_entered"]
[connection signal="area_exited" from="Guardian/InteractionArea" to="Guardian" method="_on_interaction_area_exited"]
[connection signal="pressed" from="UI/AbilityButtons/NatureMagicButton" to="Guardian" method="_on_ability_button_pressed" binds= ["nature_magic"]]
[connection signal="pressed" from="UI/AbilityButtons/RootBindingButton" to="Guardian" method="_on_ability_button_pressed" binds= ["root_binding"]]
[connection signal="pressed" from="UI/AbilityButtons/ForestWhisperButton" to="Guardian" method="_on_ability_button_pressed" binds= ["forest_whisper"]]
[connection signal="pressed" from="UI/AbilityButtons/AnimalCommunicationButton" to="Guardian" method="_on_ability_button_pressed" binds= ["animal_communication"]]
[connection signal="pressed" from="UI/DialoguePanel/NextButton" to="DialogueManager" method="_on_next_button_pressed"]`;
  
  const mainScenePath = path.join(outputDir, 'scenes', 'main.tscn');
  await writeFile(mainScenePath, mainScene);
  files.push(mainScenePath);
  
  // Generate Godot icon
  const iconSvg = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="128" height="128" rx="16" fill="#2B6B39"/>
<path d="M64 28L82 56L100 84H64H28L46 56L64 28Z" fill="#97EB85"/>
</svg>`;
  
  const iconPath = path.join(outputDir, 'icon.svg');
  await writeFile(iconPath, iconSvg);
  files.push(iconPath);

  // Generate ability button scene
  const abilityButtonScene = `[gd_scene format=3 uid="uid://d3l5xgamtjqfm"]

[node name="AbilityButton" type="Button"]
custom_minimum_size = Vector2(150, 40)
offset_right = 150.0
offset_bottom = 40.0
focus_mode = 0
text = "Ability Name"

[node name="CooldownTimer" type="Timer" parent="."]
one_shot = true

[node name="CooldownProgress" type="ProgressBar" parent="."]
layout_mode = 1
anchors_preset = 12
anchor_top = 1.0
anchor_right = 1.0
anchor_bottom = 1.0
offset_top = -4.0
grow_horizontal = 2
grow_vertical = 0
max_value = 1.0
show_percentage = false
`;

  const abilityButtonScenePath = path.join(outputDir, 'scenes', 'ui', 'ability_button.tscn');
  await writeFile(abilityButtonScenePath, abilityButtonScene);
  files.push(abilityButtonScenePath);
  
  // Generate player character script
  const playerScript = `extends CharacterBody2D

# Player script - Controls player movement and interactions

signal interaction_started(entity)
signal interaction_ended(entity)

# Movement speed in pixels per second
@export var speed: int = 200
@export var interaction_range: float = 150.0

# Reference to interactive entities in range
var interactive_entities = []
var current_interaction = null
var can_move = true
var is_in_dialogue = false

# Called when the node enters the scene tree
func _ready():
	# Add player to the "player" group for easy reference
	add_to_group("player")
	
	# Connect to dialogue manager signals
	if not DialogueManager.is_connected("dialogue_started", _on_dialogue_started):
		DialogueManager.connect("dialogue_started", _on_dialogue_started)
		
	if not DialogueManager.is_connected("dialogue_ended", _on_dialogue_ended):
		DialogueManager.connect("dialogue_ended", _on_dialogue_ended)
	
	# Connect to dialogue panel next button
	var dialogue_panel = get_node("/root/Main/UI/DialoguePanel")
	if dialogue_panel and dialogue_panel.has_node("NextButton"):
		var next_button = dialogue_panel.get_node("NextButton")
		if not next_button.is_connected("pressed", _on_dialogue_next_pressed):
			next_button.connect("pressed", _on_dialogue_next_pressed)
			print("Connected to dialogue next button")

# Process input for UI interactions
func _unhandled_input(event):
	# Handle dialogue advancement with keyboard
	if is_in_dialogue and event.is_action_pressed("interact"):
		_on_dialogue_next_pressed()
		get_viewport().set_input_as_handled()

# Get input and update player velocity
func _physics_process(delta):
	# Only process movement if allowed to move
	if can_move and not is_in_dialogue:
		var input_direction = Vector2.ZERO
		
		# Get directional input
		input_direction.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
		input_direction.y = Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
		
		# Normalize to prevent faster diagonal movement
		if input_direction.length() > 1:
			input_direction = input_direction.normalized()
		
		# Apply movement
		velocity = input_direction * speed
		
		# Flip sprite based on movement direction
		if input_direction.x != 0 and $Sprite2D:
			$Sprite2D.flip_h = input_direction.x < 0
		
		move_and_slide()
		
		# Handle interaction input
		if Input.is_action_just_pressed("interact") and interactive_entities.size() > 0:
			interact_with_closest_entity()
	else:
		# Stop movement during dialogue or when movement is disabled
		velocity = Vector2.ZERO

# Find and interact with the closest entity
func interact_with_closest_entity():
	var closest_entity = null
	var closest_distance = interaction_range
	
	# Find the closest interactive entity
	for entity in interactive_entities:
		var distance = global_position.distance_to(entity.global_position)
		if distance < closest_distance:
			closest_entity = entity
			closest_distance = distance
	
	if closest_entity and closest_entity.has_method("interact"):
		current_interaction = closest_entity
		closest_entity.interact()
		emit_signal("interaction_started", closest_entity)
		return true
	return false

# Entity entered interaction range
func _on_interaction_area_entered(area):
	# Check if the area belongs to an interactive entity
	var parent = area.get_parent()
	if parent.has_method("interact"):
		interactive_entities.append(parent)
		print("Entity entered interaction range: " + parent.name)
		
		# Show interaction hint
		var instructions = get_node_or_null("/root/Main/UI/Instructions")
		if instructions:
			instructions.visible = true

# Entity left interaction range
func _on_interaction_area_exited(area):
	# Check if the area belongs to an interactive entity
	var parent = area.get_parent()
	if parent in interactive_entities:
		interactive_entities.erase(parent)
		print("Entity left interaction range: " + parent.name)
		
		# If we were interacting with this entity, stop the interaction
		if current_interaction == parent and not is_in_dialogue:
			end_current_interaction()
		
		# Hide interaction hint if no entities in range
		if interactive_entities.size() == 0:
			var instructions = get_node_or_null("/root/Main/UI/Instructions")
			if instructions:
				instructions.visible = false

# End the current interaction
func end_current_interaction():
	if current_interaction:
		emit_signal("interaction_ended", current_interaction)
		current_interaction = null

# Dialogue started event handler
func _on_dialogue_started(character_name, dialogue_data):
	print("Dialogue started with: " + character_name)
	# Player can't move during dialogue
	is_in_dialogue = true
	velocity = Vector2.ZERO
	
	# Show dialogue panel
	var dialogue_panel = get_node_or_null("/root/Main/UI/DialoguePanel")
	if dialogue_panel:
		dialogue_panel.visible = true

# Dialogue next button pressed
func _on_dialogue_next_pressed():
	if current_interaction and current_interaction.has_method("_on_dialogue_next_pressed"):
		current_interaction._on_dialogue_next_pressed()
	elif DialogueManager.get_active_character():
		# Default handling if entity doesn't implement the method
		DialogueManager.end_dialogue()

# Dialogue ended event handler
func _on_dialogue_ended(character_name):
	print("Dialogue ended with: " + character_name)
	is_in_dialogue = false
	
	# Hide dialogue panel
	var dialogue_panel = get_node_or_null("/root/Main/UI/DialoguePanel")
	if dialogue_panel:
		dialogue_panel.visible = false
	
	# End interaction if character matches current interaction
	if current_interaction and current_interaction.guardian_name == character_name:
		end_current_interaction()
`;
  
  const playerScriptPath = path.join(outputDir, 'scripts', 'player.gd');
  await writeFile(playerScriptPath, playerScript);
  files.push(playerScriptPath);
  
  // Generate player scene
  const playerScene = `[gd_scene load_steps=4 format=3 uid="uid://bwfh60kvc4xpf"]

[ext_resource type="Script" path="res://scripts/player.gd" id="1_tkbgd"]

[sub_resource type="PlaceholderTexture2D" id="PlaceholderTexture2D_xsj0r"]

[sub_resource type="CircleShape2D" id="CircleShape2D_4t6hl"]
radius = 32.0

[node name="Player" type="CharacterBody2D" groups=["player"]]
script = ExtResource("1_tkbgd")

[node name="Sprite2D" type="Sprite2D" parent="."]
modulate = Color(0.188235, 0.407843, 0.815686, 1)
scale = Vector2(32, 64)
texture = SubResource("PlaceholderTexture2D_xsj0r")

[node name="CollisionShape2D" type="CollisionShape2D" parent="."]
shape = SubResource("CircleShape2D_4t6hl")

[node name="Camera2D" type="Camera2D" parent="."]
drag_horizontal_enabled = true
drag_vertical_enabled = true
drag_left_margin = 0.1
drag_top_margin = 0.1
drag_right_margin = 0.1
drag_bottom_margin = 0.1

[node name="InteractionArea" type="Area2D" parent="."]

[node name="CollisionShape2D" type="CollisionShape2D" parent="InteractionArea"]
shape = SubResource("CircleShape2D_4t6hl")

[node name="NameLabel" type="Label" parent="."]
offset_left = -52.0
offset_top = -48.0
offset_right = 52.0
offset_bottom = -22.0
text = "Player"
horizontal_alignment = 1

[connection signal="area_entered" from="InteractionArea" to="." method="_on_interaction_area_entered"]
[connection signal="area_exited" from="InteractionArea" to="." method="_on_interaction_area_exited"]
`;
  
  const playerScenePath = path.join(outputDir, 'scenes', 'entities', 'player.tscn');
  await writeFile(playerScenePath, playerScene);
  files.push(playerScenePath);
  
  // Write README.md
  const readmePath = path.join(outputDir, 'README.md');
  const readme = `# ${worldName} - Godot Project

Generated by [Equorn Myth-Engine](https://github.com/equorn/myth-engine)

## Guardian: ${guardian.name || 'Unknown Guardian'}
${guardian.description ? '> ' + guardian.description : ''}

## Abilities
${abilities.map(ability => `- ${ability}`).join('\n') || 'No abilities defined'}

## Project Structure

- **scenes/**: Contains all scene files (.tscn)
  - **scenes/main.tscn**: Main game scene
  - **scenes/ui/**: UI-related scenes
  - **scenes/entities/**: Character and entity scenes
  - **scenes/levels/**: Level and environment scenes
- **scripts/**: Contains all GDScript files (.gd)
  - **scripts/guardian.gd**: Guardian implementation
  - **scripts/autoload/**: Global singletons
  - **scripts/entities/**: NPC and other entity scripts
  - **scripts/ui/**: UI component scripts
- **assets/**: Contains all game assets
  - **assets/images/**: Textures and sprites
  - **assets/audio/**: Sound effects and music
  - **assets/fonts/**: Custom fonts

## Getting Started

1. Open this project in Godot Engine 4.4.1 or later
2. Open the main scene (scenes/main.tscn)
3. Press F5 to run the project
4. Click on the guardian to interact with it
5. Use the ability buttons to activate guardian powers

## Extending This Project

You can extend this project by:
- Adding more guardian abilities in the guardian script
- Creating new scenes and NPCs
- Building a complete game around the guardian concept
- Adding player character control
- Implementing more complex dialogues
`;

  await writeFile(readmePath, readme);
  files.push(readmePath);

  if (verbose) {
    console.log(`✨ Generated ${files.length} Godot project files`);
  }
  
  return files;
}

/**
 * Generate the game manager singleton script
 */
function generateGameManagerScript(worldName, guardian, npcs, locations) {
  return `extends Node

# Game Manager Singleton
# Manages global game state and world data

signal game_state_changed(new_state)
signal interaction_started(entity)

enum GameState {
	INITIALIZING,
	MAIN_MENU,
	PLAYING,
	DIALOGUE,
	PAUSED,
	GAME_OVER
}

# World data
var world_name = "${worldName}"
var current_state = GameState.INITIALIZING
var player_name = "The Prince"
var current_location = "forest_clearing"

# Entity registries
var guardians = {}
var npcs = {}
var locations = {}
var items = {}

# Called when the node enters the scene tree for the first time
func _ready():
	print("Game Manager initializing world: " + world_name)
	
	# Register the guardian
	if "${guardian.name || ''}":
		guardians["${guardian.name?.toLowerCase().replace(/\s+/g, '_') || 'main_guardian'}"] = {
			"name": "${guardian.name || 'Unknown Guardian'}",
			"description": "${guardian.description || 'A mysterious guardian'}",
			"abilities": ${JSON.stringify(guardian.abilities || [])},
			"location": "forest_clearing"
		}
	
	# Register NPCs
	${npcs.map(npc => `npcs["${npc.name.toLowerCase().replace(/\s+/g, '_')}"] = {
		"name": "${npc.name}", 
		"description": "${npc.description || 'An inhabitant of this world'}",
		"location": "${npc.location || 'forest_clearing'}"
	}`).join('\n') || '# No NPCs defined'}
	
	# Register locations
${locations.map(loc => `	locations["${loc.id || loc.name.toLowerCase().replace(/\s+/g, '_')}"] = {
		"name": "${loc.name}", 
		"description": "${loc.description || 'A location in this world'}"
	}`).join('\n') || '	locations["forest_clearing"] = {"name": "Forest Clearing", "description": "A peaceful clearing in the forest."}'}
	
	set_game_state(GameState.PLAYING)
	print("Game Manager initialized")

# Change the game state and emit signal
func set_game_state(new_state):
	# new_state is expected to be a GameState enum value
	var old_state = current_state
	current_state = new_state
	print("Game state changed from " + str(old_state) + " to " + str(new_state))
	game_state_changed.emit(new_state)

# Get info about any registered entity
func get_entity_info(entity_type: String, entity_id: String):
	match entity_type:
		"guardian":
			return guardians.get(entity_id)
		"npc":
			return npcs.get(entity_id)
		"location":
			return locations.get(entity_id)
		"item":
			return items.get(entity_id)
		_:
			return null

# Start an interaction with an entity
func start_interaction(entity_type: String, entity_id: String):
	var entity = get_entity_info(entity_type, entity_id)
	if entity:
		print("Starting interaction with " + entity.name)
		interaction_started.emit(entity)
		return true
	return false

# Save game state (placeholder for future implementation)
func save_game():
	print("Game state saved (placeholder)")

# Load game state (placeholder for future implementation)
func load_game():
	print("Game state loaded (placeholder)")

# Register a guardian entity in runtime
func register_guardian(guardian_node: Node2D):
	print("Registering guardian: " + guardian_node.guardian_name)
	guardians[guardian_node.guardian_name.to_lower().replace(" ", "_")] = {
		"name": guardian_node.guardian_name,
		"description": guardian_node.guardian_description,
		"node": guardian_node
	}
`;
}

/**
 * Generate the dialogue manager singleton script
 */
function generateDialogueManagerScript(npcs, guardian) {
  return `extends Node

# Dialogue Manager - Controls all dialogue interactions in the game

signal dialogue_started(character_name, dialogue_data)
signal dialogue_ended(character_name)

# Dialogue library for all NPCs and guardians
var dialogue_library = {}

# Currently active dialogue
var active_dialogue = null
var active_character = null
var current_dialogue_type = ""

# Called when the node enters the scene tree
func _ready():
	# Initialize dialogue library
	initialize_dialogue_library()

# Initialize the dialogue library with dialogues for all characters
func initialize_dialogue_library():
	# Add guardian dialogue
	dialogue_library["${guardian.name || 'forest_guardian'}"] = {
		"greeting": [
			"I am ${guardian.name || 'the guardian'}, protector of this forest.",
			"${guardian.description || 'I have watched over these lands for centuries.'}",
			"You may call upon my abilities if you need assistance."
		],
		"abilities": [
			"I have many abilities at my disposal.",
			"${guardian.abilities?.map(a => `I can use ${a}.`).join(' ') || 'My powers are tied to nature.'}",
			"Use the ability buttons to see my powers in action."
		],
		"nature_magic": [
			"Nature Magic is the ability to connect with the surrounding plant life.",
			"With it, I can encourage growth, heal damaged plants, and sense disturbances in the forest.",
			"This connection runs deep through the roots of this entire forest."
		],
		"root_binding": [
			"Root Binding allows me to command the very roots beneath the soil.",
			"I can entangle enemies, create barriers, or even help stabilize eroding land.",
			"The roots respond to my call and serve as extensions of my will."
		],
		"forest_whisper": [
			"Forest Whisper is a subtle form of communication with all forest life.",
			"I can send messages through the rustle of leaves, or hear news from distant parts of the woods.",
			"Many secrets are shared through these whispers for those who know how to listen."
		],
		"farewell": [
			"Farewell, traveler. May the forest guide your path.",
			"Return if you need my assistance again.",
			"The wisdom of the forest will always be here for those who seek it."
		]
	}

	# Add NPC dialogues
	${npcs.map(npc => `dialogue_library["${npc.name || 'npc_' + (npc.id || Math.floor(Math.random() * 1000))}"] = {
		"greeting": [
			"Hello there! I am ${npc.name || 'a resident of this world'}.",
			"${npc.description || 'It\'s a pleasure to meet you.'}"
		],
		"farewell": [
			"Goodbye for now!",
			"Until we meet again!"
		]
	}`).join('\n\t')}

# Start a dialogue with a character
func start_dialogue(character_id: String, dialogue_type: String = "greeting"):
	if character_id in dialogue_library:
		if dialogue_type in dialogue_library[character_id]:
			active_character = character_id
			current_dialogue_type = dialogue_type
			active_dialogue = dialogue_library[character_id][dialogue_type]
			dialogue_started.emit(character_id, {"dialogue_type": dialogue_type, "dialogue_lines": active_dialogue})
			print("Starting dialogue with " + character_id + ": " + dialogue_type)
			return true
		else:
			print("No dialogue type '" + dialogue_type + "' found for character: " + character_id)
			# Fall back to greeting
			if dialogue_type != "greeting" and "greeting" in dialogue_library[character_id]:
				return start_dialogue(character_id, "greeting")
			return false
	else:
		print("No dialogue found for character: " + character_id)
		return false

# End the current dialogue
func end_dialogue(character_id: String = ""):
	if character_id == "" or character_id == active_character:
		var ended_character = active_character
		active_dialogue = null
		active_character = null
		current_dialogue_type = ""
		dialogue_ended.emit(ended_character)
		print("Dialogue ended with " + ended_character)
		return true
	return false

# Get random dialogue for a character
func get_random_dialogue(character_id: String, dialogue_type: String = "greeting"):
	if not dialogue_library.has(character_id):
		return "..."
		
	var character_dialogues = dialogue_library[character_id]
	if not character_dialogues.has(dialogue_type):
		dialogue_type = "greeting"
		
	var dialogue_options = character_dialogues[dialogue_type]
	return dialogue_options[randi() % dialogue_options.size()]
`;
}

/**
 * Generate an NPC script for the Godot project
 */
function generateNpcScript(npc) {
  return `extends Node2D

# NPC: ${npc.name}
# ${npc.description || 'A character in the world'}

signal interaction_requested(npc_id)

# NPC properties
@export var npc_id: String = "${npc.name.toLowerCase().replace(/\s+/g, '_')}"
@export var display_name: String = "${npc.name}"
@export var dialogue_range: float = 100.0
@export var can_move: bool = ${npc.can_move !== undefined ? npc.can_move : true}

# NPC state
var current_state = "idle"
var player_in_range = false
var interaction_available = true

# Called when the node enters the scene tree
func _ready():
	print("NPC " + display_name + " initialized")
	$Label.text = display_name

# Process NPC behavior
func _process(delta):
	match current_state:
		"idle":
			# Just standing around
			pass
		"talking":
			# In dialogue with player
			pass
		"walking":
			# Moving to a destination
			if can_move:
				# Movement code would go here
				pass

# Handle interaction request from player
func interact():
	if interaction_available:
		print(display_name + ": Player initiated interaction")
		interaction_requested.emit(npc_id)
		current_state = "talking"
		
		# Let DialogueManager handle the conversation
		DialogueManager.start_dialogue(npc_id)
		return true
	return false

# Called when player enters interaction range
func _on_interaction_area_entered(area):
	if area.is_in_group("player"):
		player_in_range = true
		print(display_name + ": Player entered interaction range")

# Called when player leaves interaction range
func _on_interaction_area_exited(area):
	if area.is_in_group("player"):
		player_in_range = false
		print(display_name + ": Player left interaction range")

# Change NPC's emotional state (could affect dialogue)
func set_mood(mood: String):
	print(display_name + " mood changed to: " + mood)
	# This could change the character's sprite or behavior

# Make NPC face a target
func face_target(target_position: Vector2):
	var direction = target_position - global_position
	# Would update sprite direction here

# Respond to world events
func on_world_event(event_name: String, event_data: Dictionary):
	print(display_name + " reacting to " + event_name)
	# NPCs could have unique reactions to world events
`;
}

/**
 * Generate the guardian GDScript
 */
function generateGuardianScript(entity) {
  const abilities = entity.abilities || [];
  
  return `extends Node2D

# Guardian script for ${entity.name || 'Forest Guardian'}

signal ability_used(ability_name, success)
signal interaction_requested(guardian_id)
signal dialogue_line_completed(guardian_id)

# Guardian properties
@export var guardian_name: String = "${entity.name || 'Forest Guardian'}"
@export var guardian_description: String = "${entity.description || 'A majestic guardian of the forest.'}"
@export var interaction_range: float = 150.0

# State variables
var is_interacting = false
var is_in_dialogue = false
var current_ability_cooldowns = {}
var ability_buttons = []
var current_dialogue = []
var current_dialogue_index = 0
var player_in_range = false

# Called when the node enters the scene tree
func _ready():
	# Register with GameManager
	GameManager.register_guardian(self)
	
	# Initialize cooldown tracking for abilities
	for ability in [${abilities.map(a => '"' + a.toLowerCase().replace(/ /g, '_') + '"').join(', ')}]:
		current_ability_cooldowns[ability] = 0.0
	
	# Create UI buttons for abilities
	create_ability_buttons()
	
	# Connect dialogue signals
	DialogueManager.dialogue_started.connect(_on_dialogue_started)
	DialogueManager.dialogue_ended.connect(_on_dialogue_ended)

# Create UI buttons for each ability
func create_ability_buttons():
	# Find the ability buttons container in the UI
	var button_container = get_node("/root/Main/UI/AbilityButtons")
	if button_container:
		# Find existing buttons
		for i in range(button_container.get_child_count()):
			var button = button_container.get_child(i)
			ability_buttons.append(button)

# Process frame updates
func _process(delta):
	# Update cooldowns
	for ability in current_ability_cooldowns.keys():
		if current_ability_cooldowns[ability] > 0:
			current_ability_cooldowns[ability] -= delta
			
			# Update the corresponding button if available
			update_ability_button(ability, current_ability_cooldowns[ability])

# Update UI button to show cooldown
func update_ability_button(ability_name, cooldown_remaining):
	for button in ability_buttons:
		if button.text.to_lower().replace(" ", "_") == ability_name:
			if cooldown_remaining <= 0:
				button.disabled = false
				if button.has_node("CooldownProgress"):
					button.get_node("CooldownProgress").value = 0
			else:
				button.disabled = true
				if button.has_node("CooldownProgress"):
					# Assuming max cooldown is 5 seconds
					button.get_node("CooldownProgress").value = cooldown_remaining / 5.0

# Called when the guardian is clicked or interacted with
func interact():
	print(guardian_name + ": Interaction started")
	is_interacting = true
	interaction_requested.emit(self.name)
	
	# Tell the DialogueManager to start a dialogue
	DialogueManager.start_dialogue(guardian_name)

# Dialogue system functions
func _on_dialogue_started(character_name, dialogue_data):
	if character_name != guardian_name:
		return
		
	print(guardian_name + ": Starting dialogue")
	is_in_dialogue = true
	current_dialogue = dialogue_data.dialogue_lines
	current_dialogue_index = 0
	
	# Get the dialogue panel and show it
	var dialogue_panel = get_node("/root/Main/UI/DialoguePanel")
	if dialogue_panel:
		dialogue_panel.visible = true
		
		# Set speaker name
		if dialogue_panel.has_node("SpeakerName"):
			dialogue_panel.get_node("SpeakerName").text = guardian_name + ":"
		
		# Show first dialogue line
		show_dialogue_line()

# Show the current dialogue line
func show_dialogue_line():
	if current_dialogue_index >= current_dialogue.size():
		end_dialogue()
		return
		
	var dialogue_panel = get_node("/root/Main/UI/DialoguePanel")
	if dialogue_panel and dialogue_panel.has_node("DialogueText"):
		var line = current_dialogue[current_dialogue_index]
		dialogue_panel.get_node("DialogueText").text = line
		current_dialogue_index += 1
		dialogue_line_completed.emit(self.name)

func _on_dialogue_next_pressed():
	# Advance to next dialogue line
	show_dialogue_line()

func _on_dialogue_ended(_character_name: String):
	print(guardian_name + ": Dialogue ended")
	is_in_dialogue = false
	is_interacting = false
	
	# Hide dialogue panel
	var dialogue_panel = get_node("/root/Main/UI/DialoguePanel")
	if dialogue_panel:
		dialogue_panel.visible = false

func end_dialogue():
	DialogueManager.end_dialogue(guardian_name)

# Handle player entering and exiting interaction range
func _on_interaction_area_entered(area):
	if area.get_parent().is_in_group("player"):
		player_in_range = true
		print(guardian_name + ": Player entered interaction range")


func _on_interaction_area_exited(area):
	if area.get_parent().is_in_group("player"):
		player_in_range = false
		print(guardian_name + ": Player exited interaction range")

# Use an ability
func use_ability(ability_name: String):
	# Check if ability is on cooldown
	if current_ability_cooldowns.has(ability_name) and current_ability_cooldowns[ability_name] <= 0:
		print(guardian_name + ": Using ability " + ability_name)
		
		# Apply cooldown (different abilities could have different cooldowns)
		current_ability_cooldowns[ability_name] = 5.0  # 5 second cooldown by default
		
		# Execute the ability based on name
		match ability_name:
			"nature_magic":
				return _use_nature_magic()
			"root_binding":
				return _use_root_binding()
			"forest_whisper":
				return _use_forest_whisper()
			"healing_bloom":
				return _use_healing_bloom()
			"animal_communication":
				return _use_animal_communication()
			_:
				print("Unknown ability: " + ability_name)
				ability_used.emit(ability_name, false)
				return false
	else:
		print(guardian_name + ": Ability on cooldown: " + ability_name)
		return false

# Handle ability button press
func _on_ability_button_pressed(ability_name):
	use_ability(ability_name)

# Nature Magic ability
func _use_nature_magic():
	# Visual feedback
	if $AbilityEffects/NatureMagic:
		$AbilityEffects/NatureMagic.emitting = true
	
	print(guardian_name + ": Channels the energy of nearby plants, creating a swirl of magical energy")
	
	# Emit the ability used signal
	ability_used.emit("nature_magic", true)
	
	# Tell the GameManager about the ability usage
	GameManager.world_event.emit("nature_magic_used", {"user": guardian_name, "position": global_position})
	
	return true

# Root Binding ability
func _use_root_binding():
	# Visual feedback
	if $AbilityEffects/RootBinding:
		$AbilityEffects/RootBinding.emitting = true
	
	print(guardian_name + ": Summons roots from the ground to entangle nearby creatures")
	
	# Emit the ability used signal
	ability_used.emit("root_binding", true)
	
	# Tell the GameManager about the ability usage
	GameManager.world_event.emit("root_binding_used", {"user": guardian_name, "position": global_position})
	
	return true

# Forest Whisper ability
func _use_forest_whisper():
	# Visual feedback
	if $AbilityEffects/ForestWhisper:
		$AbilityEffects/ForestWhisper.emitting = true
	
	print(guardian_name + ": Communicates with the forest, revealing hidden secrets")
	
	# Emit the ability used signal
	ability_used.emit("forest_whisper", true)
	
	# Tell the GameManager about the ability usage
	GameManager.world_event.emit("forest_whisper_used", {"user": guardian_name, "position": global_position})
	
	return true

# Healing Bloom ability
func _use_healing_bloom():
	print(guardian_name + ": Creates a bloom of healing energy that restores vitality")
	
	# Emit the ability used signal
	ability_used.emit("healing_bloom", true)
	
	# Tell the GameManager about the ability usage
	GameManager.world_event.emit("healing_bloom_used", {"user": guardian_name, "position": global_position})
	
	return true

# Animal Communication ability
func _use_animal_communication():
	print(guardian_name + ": Speaks with nearby animals, gaining their assistance")
	
	# Visual feedback
	if $AbilityEffects/AnimalCommunication:
		$AbilityEffects/AnimalCommunication.emitting = true
	
	# Emit the ability used signal
	ability_used.emit("animal_communication", true)
	
	# Tell the GameManager about the ability usage
	GameManager.world_event.emit("animal_communication_used", {"user": guardian_name, "position": global_position})
	
	return true
`;
}

// Run the CLI
program.parse();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

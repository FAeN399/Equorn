extends Node2D

# Guardian script for Thornweave

signal ability_used(ability_name, success)
signal interaction_requested(guardian_id)
signal dialogue_line_completed(guardian_id)

# Guardian properties
@export var guardian_name: String = "Thornweave"
@export var guardian_description: String = "An ancient tree-spirit bound to protect the grove"
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
	for ability in ["nature_magic", "root_entangle", "bark_armor"]:
		current_ability_cooldowns[ability] = 0.0
	
	# Create UI buttons for abilities
	create_ability_buttons()
	
	# Connect dialogue signals
	DialogueManager.dialogue_started.connect(_on_dialogue_started)
	DialogueManager.dialogue_ended.connect(_on_dialogue_ended)

# Create UI buttons for each ability
func create_ability_buttons():
	# Find the ability buttons container in the UI
	var button_container = $"/root/Main/UI/AbilityButtons"
	if button_container:
		# Find existing buttons
		for i in range(button_container.get_child_count()):
			var button = button_container.get_child(i)
			ability_buttons.append(button)

# Process frame updates
func _process(delta: float):
	# Update cooldowns
	for ability in current_ability_cooldowns.keys():
		if current_ability_cooldowns[ability] > 0:
			current_ability_cooldowns[ability] -= delta
			
			# Update the corresponding button if available
			update_ability_button(ability, current_ability_cooldowns[ability])

# Update UI button to show cooldown
func update_ability_button(ability_name: String, cooldown_remaining: float):
	for button in ability_buttons:
		if button.text.to_lower().replace(" ", "_") == ability_name:
			if cooldown_remaining <= 0:
				button.disabled = false
				if button.has_node("CooldownProgress"):
					button.get_node("CooldownProgress").value = 0 # Could use %CooldownProgress if uniquely named
			else:
				button.disabled = true
				if button.has_node("CooldownProgress"):
					# Assuming max cooldown is 5 seconds
					button.get_node("CooldownProgress").value = cooldown_remaining / 5.0 # Could use %CooldownProgress if uniquely named

# Called when the guardian is clicked or interacted with
func interact():
	print(guardian_name + ": Interaction started")
	is_interacting = true
	interaction_requested.emit(self.name)
	
	# Tell the DialogueManager to start a dialogue
	DialogueManager.start_dialogue(guardian_name)

# Dialogue system functions
func _on_dialogue_started(character_name: String, dialogue_data: Dictionary):
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
			dialogue_panel.get_node("SpeakerName").text = guardian_name + ":" # Could use %SpeakerName if uniquely named
		
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
		dialogue_panel.get_node("DialogueText").text = line # Could use %DialogueText if uniquely named
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
func _on_interaction_area_entered(area: Area2D):
	if area.get_parent().is_in_group("player"):
		player_in_range = true
		print(guardian_name + ": Player entered interaction range")


func _on_interaction_area_exited(area: Area2D):
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
func _on_ability_button_pressed(ability_name: String):
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

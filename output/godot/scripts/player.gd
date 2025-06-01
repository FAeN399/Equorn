extends CharacterBody2D

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
	DialogueManager.dialogue_started.connect(_on_dialogue_started)
	DialogueManager.dialogue_ended.connect(_on_dialogue_ended)
	
	# Connect to dialogue panel next button
	var dialogue_panel = $"/root/Main/UI/DialoguePanel"
	if dialogue_panel and dialogue_panel.has_node("NextButton"):
		var next_button = dialogue_panel.get_node("NextButton") # Could use %NextButton if uniquely named
		next_button.pressed.connect(_on_dialogue_next_pressed)
		print("Connected to dialogue next button")

# Process input for UI interactions
func _unhandled_input(event: InputEvent):
	# Handle dialogue advancement with keyboard
	if is_in_dialogue and event.is_action_pressed("interact"):
		_on_dialogue_next_pressed()
		get_viewport().set_input_as_handled()

# Get input and update player velocity
func _physics_process(_delta: float):
	# Only process movement if allowed to move
	if can_move and not is_in_dialogue:
		var input_direction = Vector2.ZERO
		
		# Get directional input using modern Input.get_axis() method
		input_direction.x = Input.get_axis("move_left", "move_right")
		input_direction.y = Input.get_axis("move_up", "move_down")
		
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
		interaction_started.emit(closest_entity)
		return true
	return false

# Entity entered interaction range
func _on_interaction_area_entered(area: Area2D):
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
func _on_interaction_area_exited(area: Area2D):
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
			var instructions = $"/root/Main/UI/Instructions"
			if instructions:
				instructions.visible = false

# End the current interaction
func end_current_interaction():
	if current_interaction:
		interaction_ended.emit(current_interaction)
		current_interaction = null

# Dialogue started event handler
func _on_dialogue_started(character_name: String, _dialogue_data: Dictionary):
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
func _on_dialogue_ended(character_name: String):
	print("Dialogue ended with: " + character_name)
	is_in_dialogue = false
	
	# Hide dialogue panel
	var dialogue_panel = get_node_or_null("/root/Main/UI/DialoguePanel")
	if dialogue_panel:
		dialogue_panel.visible = false
	
	# End interaction if character matches current interaction
	if current_interaction and current_interaction.guardian_name == character_name:
		end_current_interaction()

extends Node

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
var world_name = "Whispering Woods"
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
	if "Thornweave":
		guardians["thornweave"] = {
			"name": "Thornweave",
			"description": "An ancient tree-spirit bound to protect the grove",
			"abilities": ["nature_magic","root_entangle","bark_armor"],
			"location": "forest_clearing"
		}
	
	# Register NPCs
	# No NPCs defined
	
	# Register locations
	locations["sacred_grove"] = {
		"name": "sacred_grove", 
		"description": "A circle of ancient oaks humming with magical energy"
	}
	locations["forest_path"] = {
		"name": "forest_path", 
		"description": "A winding trail through dense undergrowth"
	}
	
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

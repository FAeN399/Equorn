extends Node

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
	dialogue_library["Thornweave"] = {
		"greeting": [
			"I am Thornweave, protector of this forest.",
			"An ancient tree-spirit bound to protect the grove",
			"You may call upon my abilities if you need assistance."
		],
		"abilities": [
			"I have many abilities at my disposal.",
			"I can use nature_magic. I can use root_entangle. I can use bark_armor.",
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

extends Node2D

# Guardian properties  
var guardian_name = "Thornweave"
var abilities = ["nature_magic","root_entangle","bark_armor"]
var description = "An ancient tree-spirit bound to protect the grove"

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
	print("Thornweave channels the power of the forest!")

func entangle_enemies():
	print("Roots burst from the ground to entangle foes!")
	
func activate_defense():
	print("Guardian's bark hardens into natural armor!")
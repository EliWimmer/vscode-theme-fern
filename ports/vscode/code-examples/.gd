extends Node2D

signal player_hit(damage: int)
const MAX_SPEED := 300.0
@export var health := 100

# This variable is never used - will cause a warning
var unused_variable := "test"

class_name Enemy

func _ready() -> void:
    var test_array := ["hello", "world", 42]
    var dict := {
        "name": "Boss",
        "power": 9000,
    }

    # This will cause an error - accessing undefined variable
    print(undefined_variable)

func take_damage(amount: float) -> void:
    health -= amount
    player_hit.emit(amount)

    if health <= 0:
        queue_free()

func _process(delta: float) -> void:
    var movement := Vector2.ZERO
    if Input.is_action_pressed("ui_right"):
        movement.x += 1.0

    position += movement.normalized() * MAX_SPEED * delta

    match health:
        100:
            print("Full health!")
        0:
            print("Game over!")
        _:
            print("Taking damage...")

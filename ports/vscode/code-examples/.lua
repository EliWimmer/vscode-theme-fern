-- Example Lua code with various syntax elements
local function calculateDistance(point1, point2)
  -- Constants and numbers
  local PI = 3.14159
  local SPEED_OF_LIGHT = 3e8

  -- String manipulation
  local message = "Computing distance..."
  local multiline = [[
      Multiple lines
      of text here
  ]]

  -- This will cause an error (undefined variable)
  local result = undefinedVariable + 10

  -- This will cause a warning (unused variable)
  local unusedVar = 42

  -- Table operations
  local points = {
    x = point1.x - point2.x,
    y = point1.y - point2.y
  }

  -- Mathematical operations
  local distance = math.sqrt(points.x ^ 2 + points.y ^ 2)

  -- Conditional logic
  if distance > 0 then
    print(string.format("Distance: %.2f units", distance))
  else
    error("Invalid distance calculation")
  end

  return distance
end

-- Function call with table constructor
local p1 = { x = 0, y = 0 }
local p2 = { x = 3, y = 4 }
calculateDistance(p1, p2)

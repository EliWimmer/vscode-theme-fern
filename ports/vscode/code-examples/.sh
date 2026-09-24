#!/bin/bash

# Define some colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function with a deliberate error (undefined variable usage)
function test_error() {
    echo $undefined_var # This will cause an error
}

# Warning - comparison using = instead of ==
if [ "$1" = 2 ]; then
    echo "Warning: using = for comparison"
fi

# Array declaration and iteration
declare -a fruits=("apple" "banana" "orange")
for fruit in "${fruits[@]}"; do
    echo -e "${GREEN}Processing $fruit...${NC}"
done

# Command substitution and arithmetic
current_time=$(date +%s)
result=$((current_time % 60))

# Pipe and grep with regex
ps aux | grep -E "[n]ginx|[a]pache2"

# Here document with variable interpolation
cat << EOF
Server Status: RUNNING
Time: $current_time
User: $USER
EOF

# Exit with success
exit 0

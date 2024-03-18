#!/bin/bash

# Check if the correct number of arguments are provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

# Assign arguments to variables
custom_string="$1"

# Perform the replacement and save to output file
sed "s/<%version%>/$custom_string/g" "angular.json" > "angular.json.tmp" && mv "angular.json.tmp" "angular.json"

echo "Template string replaced successfully.  🎉"

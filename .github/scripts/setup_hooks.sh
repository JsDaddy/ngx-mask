#!/bin/bash

# Define the directory containing sample hooks
SAMPLE_HOOKS_DIR=".github/hooks"

# Define the target directory for Git hooks
GIT_HOOKS_DIR=".git/hooks"

# Function to copy or replace hooks
copy_or_replace_hooks() {
    for hook in "$SAMPLE_HOOKS_DIR"/*; do
        hook_name=$(basename "$hook")
        target_hook="$GIT_HOOKS_DIR/$hook_name"
        if [ -f "$target_hook" ]; then
            echo "Replacing existing hook: $hook_name"
        else
            echo "Copying new hook: $hook_name"
        fi
        cp "$hook" "$target_hook"
        chmod ug+x "$target_hook"  # Ensure executable permission is set
    done
}

# Main function
main() {
    # Check if .git/hooks directory exists
    if [ ! -d "$GIT_HOOKS_DIR" ]; then
        echo "Error: .git/hooks directory not found. Are you in a Git repository?"
        exit 1
    fi

    # Copy or replace hooks
    copy_or_replace_hooks

    echo "Git hooks setup complete."
}

# Run the main function
main

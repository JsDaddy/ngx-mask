#!/usr/bin

set -e

bun lint

# run snyk:auth -- $snyk_token
# bun run snyk:test

output=$(bun run type-coverage)
if echo "$output" | grep -q "lower than "; then
    echo "$output"
    exit 1  # Terminate the hook script with a non-zero exit code
else
    echo "Type coverage is good! 🎉"
fi

#bun run test
#bun run cypress:bash

bun run build

bun run build:lib

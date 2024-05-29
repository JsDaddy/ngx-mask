#!/usr/bin

set -e

npm run lint

npm run snyk:auth -- $snyk_token
npm run snyk:test

output=$(npm run type-coverage)
if echo "$output" | grep -q "lower than "; then
    echo "$output"
    exit 1  # Terminate the hook script with a non-zero exit code
else
    echo "Type coverage is good! 🎉"
fi

npm run test
npm run cypress:bash

npm run build

npm run build:lib

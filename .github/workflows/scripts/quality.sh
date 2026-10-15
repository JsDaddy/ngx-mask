#!/usr/bin/env bash

set -euo pipefail

bun run lint # includes lint:scss

output=$(bun run type-coverage)
if echo "$output" | grep -q "lower than "; then
    echo "$output"
    exit 1
else
    echo "Type coverage is good!"
fi

bun run test
bun run cypress:bash

bun run build

bun run build:lib

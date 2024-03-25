#!/usr/bin

set -e

commit_msg=$(cat .git/COMMIT_EDITMSG)
echo "$commit_msg" | npx  commitlint
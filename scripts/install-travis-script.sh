#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

npm install

if [ "$RUN_PROD" = true ]; then
  ng version
else
  git diff --exit-code
  ng version
  npm install codecov
fi

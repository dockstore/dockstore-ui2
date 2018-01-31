#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm install --production
  git diff --exit-code
  ng version
else
  npm install
  ng version
  npm install codecov
fi

#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm install --production
  ng version
else
  npm install
  git diff --exit-code
  ng version
  npm install codecov
fi

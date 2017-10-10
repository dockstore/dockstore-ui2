#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm run-script prebuild
  ng build --prod
  npm shrinkwrap
else
  # Only run main tests if not prod
  npm run-script prebuild
  ng build
  ng serve --silent &
  ng test --watch=false --code-coverage
  cypress run --record --config defaultCommandTimeout=10000
fi

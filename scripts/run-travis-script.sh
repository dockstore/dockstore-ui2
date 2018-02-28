#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm run-script prebuild
  ng build --progress false --prod
else
  # Only run main tests if not prod
  npm run-script prebuild
  ng lint
  ng build --progress false
  ng serve --silent &
  ng test --watch=false --code-coverage --browsers ChromeHeadless
  cypress run --record --config defaultCommandTimeout=10000
fi

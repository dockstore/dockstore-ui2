#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm run build.prod
else
  # Only run main tests if not prod
  ng lint
  npm run build
  ng serve --progress=false &
  ng test --watch=false --code-coverage --browsers ChromeHeadless
  cypress run --record --config defaultCommandTimeout=10000
fi

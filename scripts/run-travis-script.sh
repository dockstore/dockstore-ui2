#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm run-script prebuild
  ng build --progress false --prod
  # silly hack needed, take out when angular-tag-cloud-module is updated
  perl -pi -e 's/\^2.4.3/4.3.6/g' node_modules/angular-tag-cloud-module/package.json
  npm shrinkwrap
else
  # Only run main tests if not prod
  npm run-script prebuild
  ng lint
  ng build --progress false
  ng serve --silent &
  ng test --watch=false --code-coverage
  cypress run --record --config defaultCommandTimeout=10000
fi

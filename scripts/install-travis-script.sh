#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$RUN_PROD" = true ]; then
  npm install -g bower
  npm install --production
  bower install
  ng version
else
  npm install -g bower
  npm install
  bower install
  ng version
  npm install codecov
fi

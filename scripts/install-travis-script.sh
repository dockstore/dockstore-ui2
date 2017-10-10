#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

echo "${TRAVIS_BRANCH}"
echo "${TRAVIS_PULL_REQUEST}"
echo "${TRAVIS_PULL_REQUEST_BRANCH}"
echo "${TRAVIS_PULL_REQUEST_SHA}"

if [ ${#RUN_PROD} == "true" ]; then
  npm install -g bower
  npm install --production
  bower update
  ng version
else
  npm install -g bower
  npm install
  bower update
  ng version
  npm install codecov
fi

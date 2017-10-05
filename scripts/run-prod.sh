#!/bin/bash
set -ev

echo "${TRAVIS_BRANCH}"
echo "${TRAVIS_PULL_REQUEST}"
echo "${TRAVIS_PULL_REQUEST_BRANCH}"
echo "${TRAVIS_PULL_REQUEST_SHA}"

if [ ${#RUN_PROD} == "true" ]; then
  ng build --prod;
else
  # Only run main tests if not prod
  ng build;
  ng serve --silent &;
  ng test --watch=false --code-coverage;
  cypress run --record --config defaultCommandTimeout=10000;
fi

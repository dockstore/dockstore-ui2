#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

# This script gets the base branch of the PR

PR_NUMBER="${CIRCLE_PULL_REQUEST##*/}"
BASE_BRANCH=$(curl "https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PR_NUMBER}" | jq -r '.base.ref' )

echo "${BASE_BRANCH}"
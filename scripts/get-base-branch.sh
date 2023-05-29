#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

# This script gets the base branch of the PR and is meant to be used by CircleCI jobs

# CIRCLE_PULL_REQUEST is an environment variable set by CircleCI if a pull request exists
# https://circleci.com/docs/variables/#built-in-environment-variables
PR_NUMBER="${CIRCLE_PULL_REQUEST##*/}"

if [[ -z "${PR_NUMBER}" ]]; then
    echo "A PR number is required to get the base branch"
    exit 1
fi

BASE_BRANCH=$(curl "https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PR_NUMBER}" | jq -r '.base.ref' )

echo "${BASE_BRANCH}"

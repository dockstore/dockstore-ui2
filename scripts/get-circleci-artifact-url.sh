#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [[ -z ${1} || -z ${2} ]]; then
    echo "Usage: $0 <circleci-build-id> <circleci-artifact-name>"
    exit 1
fi

# This script gets the URL for a CircleCI artifact. 
# It looks at all of the artifacts for a CircleCI build with <circleci-build-id> and returns the URL of the artifact with a path that contains <circleci-artifact-name>.

CIRCLECI_BUILD_ID=${1}
ARTIFACT_NAME=${2}
ARTIFACT_URL=$(curl "https://circleci.com/api/v2/project/gh/dockstore/dockstore/${CIRCLECI_BUILD_ID}/artifacts" -H "Accept: application/json" | jq -r --arg ARTIFACT_PATH "${ARTIFACT_NAME}" '.items[] | select( .path | contains($ARTIFACT_PATH) ) | .url ')

echo "${ARTIFACT_URL}"
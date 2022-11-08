#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

STACK=$1

if [ "$STACK" == "qa" ]
then
  URL="https://qa.dockstore.org"
  TOKEN=${CYPRESS_QA_TOKEN}
elif [ "$STACK" == "staging" ]
then
  URL="https://staging.dockstore.org"
  TOKEN=${CYPRESS_STAGING_TOKEN}
elif [ "$STACK" == "prod" ]
then
  URL="https://dockstore.org"
  TOKEN=${CYPRESS_PROD_TOKEN}
else
  echo "Provided stack does not exist"
  exit 1
fi

#The function getUser takes username as argument to get the user JSON object and user id.
function getUser {
  USERNAME=$1
  USER=$(curl -X 'GET' \
  "${URL}/api/users/username/${USERNAME}" \
  -H 'accept: application/json')
  USER_ID=$(echo "$USER" | jq -r ".id")
}


function getUserPublishedWorkflows {
  PUBLISHED_WORKFLOWS_IDS=$(curl -X 'GET' \
    "${URL}/api/users/${USER_ID}/workflows/published" \
    -H 'accept: application/json' \
    -H "Authorization: Bearer ${TOKEN}" | jq .[].id)
}

function getUserRegisteredTools {
  REGISTERED_TOOLS_IDS=$(curl -X 'GET' \
  "${URL}/api/users/${USER_ID}/containers" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H 'accept: application/json' | jq .[].id
  )
}

#This function will first unpublish all of the user's workflows and tools then delete its registered tools.
function resetUserResources {
  for WORKFLOW_ID in ${PUBLISHED_WORKFLOWS_IDS}
  do
    curl -X 'POST' \
      "${URL}/api/workflows/${WORKFLOW_ID}/publish" \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -H "Authorization: Bearer ${TOKEN}" \
      -d '{
      "publish": false
      }'
  done

  for TOOL_ID in ${REGISTERED_TOOLS_IDS}
  do
    curl -X 'POST' \
      "${URL}/api/containers/${TOOL_ID}/publish" \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -H "Authorization: Bearer ${TOKEN}" \
      -d '{
      "publish": false
      }'
    curl -X 'DELETE' \
      "${URL}/api/containers/${TOOL_ID}" \
      -H 'accept: application/json' \
      -H "Authorization: Bearer ${TOKEN}"
  done
}

getUser "DockstoreTestUser4"
getUserPublishedWorkflows
getUserRegisteredTools
resetUserResources



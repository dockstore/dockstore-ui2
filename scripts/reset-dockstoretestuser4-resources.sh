#!/bin/bash

STACK=$1

echo "$STACK"

if [ "$STACK" == "qa" ]
then
  URL="https://qa.dockstore.org"
  TOKEN=${CYPRESS_QA_TOKEN}
elif [ "$STACK" == "staging" ]
then
  URL="https://staging.dockstore.org"
  TOKEN=${CYPRESS_STAGING_TOKEN}
else
  URL="https://dockstore.org"
  TOKEN=${CYPRESS_PROD_TOKEN}
fi

echo "$URL"

USER=$(curl -X 'GET' \
  "${URL}/api/users/username/dockstoretestuser4" \
  -H 'accept: application/json')

USER_ID=$(echo "$USER" | jq -r ".id")

echo "$USER"
echo "$USER_ID"

PUBLISHED_WORKFLOWS=$(curl -X 'GET' \
  "${URL}/api/users/${USER_ID}/workflows/published" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
)

REGISTERED_TOOLS=$(curl -X 'GET' \
"${URL}/api/users/${USER_ID}/containers" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'accept: application/json'
)
echo "$REGISTERED_TOOLS"
echo "$PUBLISHED_WORKFLOWS"

for WORKFLOW in $PUBLISHED_WORKFLOWS
do
  WORKFLOW_ID=$(echo "$WORKFLOW" | jq -r ".id")
  curl -X 'POST' \
    "${URL}/api/workflows/${WORKFLOW_ID}/publish" \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${TOKEN}" \
    -d '{
    "publish": false
  }'
done

for TOOL in $REGISTERED_TOOLS
do
  TOOL_ID=$(echo "$TOOL"| jq -r ".id")
  curl -X 'DELETE' \
    "${URL}/api/containers/${TOOL_ID}" \
    -H 'accept: application/json' \
    -H "Authorization: Bearer ${TOKEN}"
done

PUBLISHED_WORKFLOWS=$(curl -X 'GET' \
  "${URL}/api/users/${USER_ID}/workflows/published" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}")

REGISTERED_TOOLS=$(curl -X 'GET' \
"${URL}/api/users/${USER_ID}/containers" \
 -H 'accept: application/json' \
 -H "Authorization: Bearer ${TOKEN}"
)
echo "$REGISTERED_TOOLS"
echo "$PUBLISHED_WORKFLOWS"

#!/bin/bash

USER = $(curl -X 'GET' \
  'https://dockstore.org/api/users/username/DockstoreTestUser4' \
  -H 'accept: application/json')

PUBLISHED_WORKFLOWS=$(curl -X 'GET' \
  'https://dockstore.org/api/users/${USER.id}/workflows/published' \
  -H 'accept: application/json')

REGISTERED_TOOLS=$(curl -X 'GET' \
'https://dockstore.org/api/users/${USER.id}/containers' \
 -H 'accept: application/json'
)
echo $REGISTERED_TOOLS
echo $PUBLISHED_WORKFLOWS

for WORKFLOW in PUBLISHED_WORKFLOWS
do
  curl -X 'POST' \
    'https://dockstore.org/api/workflows/${WORKFLOW.id}/publish' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "publish": false
  }'
done

for TOOL in REGISTERED_TOOLS
do
  curl -X 'DELETE' \
    'https://dockstore.org/api/containers/${TOOL.id}' \
    -H 'accept: application/json'
done

PUBLISHED_WORKFLOWS=$(curl -X 'GET' \
  'https://dockstore.org/api/users/${USER.id}/workflows/published' \
  -H 'accept: application/json')

REGISTERED_TOOLS=$(curl -X 'GET' \
'https://dockstore.org/api/users/${USER.id}/containers' \
 -H 'accept: application/json'
)
echo $REGISTERED_TOOLS
echo $PUBLISHED_WORKFLOWS

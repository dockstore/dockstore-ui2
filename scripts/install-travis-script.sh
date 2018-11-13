#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

npm ci

wget --no-verbose --tries=10 https://artifacts.oicr.on.ca/artifactory/collab-release/io/dockstore/dockstore-webservice/${WEBSERVICE_VERSION}/dockstore-webservice-${WEBSERVICE_VERSION}.jar
chmod u+x dockstore-webservice-${WEBSERVICE_VERSION}.jar
ng version
npm install codecov

npm run prebuild

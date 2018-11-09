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

wget --no-verbose http://central.maven.org/maven2/org/openapitools/openapi-generator-cli/3.3.1/openapi-generator-cli-3.3.1.jar -O swagger-codegen-cli.jar
java -jar swagger-codegen-cli.jar generate -i https://raw.githubusercontent.com/ga4gh/dockstore/${WEBSERVICE_VERSION}/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json

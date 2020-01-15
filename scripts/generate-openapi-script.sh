#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

GENERATOR_VERSION="3.3.4"
BASE_PATH="https://raw.githubusercontent.com/dockstore/dockstore/$npm_package_config_webservice_version"
# DOCKSTORE-2428 - demo how to add new workflow language, generate from local copy of swagger
# BASE_PATH="../dockstore"

wget --no-verbose https://repo.maven.apache.org/maven2/org/openapitools/openapi-generator-cli/${GENERATOR_VERSION}/openapi-generator-cli-${GENERATOR_VERSION}.jar -O openapi-generator-cli.jar
rm -Rf src/app/shared/swagger
rm -Rf src/app/shared/openapi
java -jar openapi-generator-cli.jar generate -i ${BASE_PATH}/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json
java -jar openapi-generator-cli.jar generate -i ${BASE_PATH}/dockstore-webservice/src/main/resources/openapi3/openapi.yaml -l typescript-angular -o src/app/shared/openapi -c swagger-config.json
rm openapi-generator-cli.jar


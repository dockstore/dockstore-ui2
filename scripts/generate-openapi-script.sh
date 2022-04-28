#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

GENERATOR_VERSION="4.3.0"
BASE_PATH="https://raw.githubusercontent.com/dockstore/dockstore/$npm_package_config_webservice_version"
# DOCKSTORE-2428 - demo how to add new workflow language, generate from local copy of swagger
# Uncomment this to use your local copy of swagger instead
# BASE_PATH="../dockstore"


wget --no-verbose https://repo.maven.apache.org/maven2/org/openapitools/openapi-generator-cli/${GENERATOR_VERSION}/openapi-generator-cli-${GENERATOR_VERSION}.jar -O openapi-generator-cli.jar
rm -Rf src/app/shared/swagger
rm -Rf src/app/shared/openapi

if [ "$npm_package_config_use_circle" = true ]
then
        SWAGGER_PATH=$(./scripts/get-circleci-artifact-url.sh $npm_package_config_circle_build_id swagger.yaml)
        OPENAPI_PATH=$(./scripts/get-circleci-artifact-url.sh $npm_package_config_circle_build_id openapi.yaml)
else
        SWAGGER_PATH="${BASE_PATH}""/dockstore-webservice/src/main/resources/swagger.yaml"
        OPENAPI_PATH="${BASE_PATH}""/dockstore-webservice/src/main/resources/openapi3/openapi.yaml"
fi

java -jar openapi-generator-cli.jar generate -i "${SWAGGER_PATH}" -g typescript-angular -o src/app/shared/swagger -c swagger-config.json --skip-validate-spec
java -jar openapi-generator-cli.jar generate -i "${OPENAPI_PATH}" -g typescript-angular -o src/app/shared/openapi -c swagger-config.json --skip-validate-spec
rm openapi-generator-cli.jar

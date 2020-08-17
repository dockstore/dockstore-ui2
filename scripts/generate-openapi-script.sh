#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

GENERATOR_VERSION="3.3.4"



# Uncomment this to use the actual Dockstore webservice release from the package.json
# BASE_PATH="https://raw.githubusercontent.com/dockstore/dockstore/$npm_package_config_webservice_version"
# Uncomment this to use the CircleCI swagger/openapi instead
CIRCLE_CI_PATH="https://4674-33383826-gh.circle-artifacts.com/0/tmp/artifacts" 
# DOCKSTORE-2428 - demo how to add new workflow language, generate from local copy of swagger
# Uncomment this to use your local copy of swagger instead
# BASE_PATH="../dockstore"


wget --no-verbose https://repo.maven.apache.org/maven2/org/openapitools/openapi-generator-cli/${GENERATOR_VERSION}/openapi-generator-cli-${GENERATOR_VERSION}.jar -O openapi-generator-cli.jar
rm -Rf src/app/shared/swagger
rm -Rf src/app/shared/openapi



# Uncomment these two lines to use the actual Dockstore webservice release from the package.json
#java -jar openapi-generator-cli.jar generate -i ${BASE_PATH}/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json
#java -jar openapi-generator-cli.jar generate -i ${BASE_PATH}/dockstore-webservice/src/main/resources/openapi3/openapi.yaml -l typescript-angular -o src/app/shared/openapi -c swagger-config.json
# Uncomment these two lines to use the CircleCI swagger/openapi instead
java -jar openapi-generator-cli.jar generate -i ${CIRCLE_CI_PATH}/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json
java -jar openapi-generator-cli.jar generate -i ${CIRCLE_CI_PATH}/openapi.yaml -l typescript-angular -o src/app/shared/openapi -c swagger-config.json



rm openapi-generator-cli.jar


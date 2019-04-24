#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

GENERATOR_VERSION="3.3.4"
wget --no-verbose http://central.maven.org/maven2/org/openapitools/openapi-generator-cli/${GENERATOR_VERSION}/openapi-generator-cli-${GENERATOR_VERSION}.jar -O openapi-generator-cli.jar
rm -Rf src/app/shared/swagger
java -jar openapi-generator-cli.jar generate -i https://raw.githubusercontent.com/ga4gh/dockstore/$npm_package_config_webservice_version/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json
rm -Rf openapi-generator-cli.jar

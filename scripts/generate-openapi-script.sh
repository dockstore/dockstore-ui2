#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

wget --no-verbose http://central.maven.org/maven2/org/openapitools/openapi-generator-cli/3.3.4/openapi-generator-cli-3.3.4.jar -O openapi-generator-cli-3.3.4.jar
rm -Rf src/app/shared/swagger
java -jar openapi-generator-cli-3.3.4.jar generate -i https://raw.githubusercontent.com/ga4gh/dockstore/$npm_package_config_webservice_version/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json

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
rm -Rf src/app/shared/openapi

if [ "$npm_package_config_use_github_packages" = true ]
then
        mvn dependency:get -DremoteRepositories=github-packages:https://maven.pkg.github.com/dockstore/dockstore -Dartifact=io.dockstore:dockstore-webservice:${npm_package_config_webservice_version_prefix}-SNAPSHOT:openapi.yaml:dist -Dtransitive=false --batch-mode -ntp -s .github/snapshot-mvn-settings.xml
	      mvn dependency:copy  -Dartifact=io.dockstore:dockstore-webservice:${npm_package_config_webservice_version_prefix}-SNAPSHOT:openapi.yaml:dist -DoutputDirectory=. -Dmdep.useBaseVersion=true -batch-mode -ntp -s .github/snapshot-mvn-settings.xml
        OPENAPI_PATH=dockstore-webservice-${npm_package_config_webservice_version_prefix}-SNAPSHOT-dist.openapi.yaml
else
        OPENAPI_PATH="${BASE_PATH}""/dockstore-webservice/src/main/resources/openapi3/openapi.yaml"
fi

java -jar openapi-generator-cli.jar generate -i "${OPENAPI_PATH}" -g typescript-angular -o src/app/shared/openapi -c swagger-config.json --skip-validate-spec
rm openapi-generator-cli.jar

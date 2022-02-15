#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

if [ "$npm_package_config_use_circle" = true ]
then
	JAR_PATH="https://""${npm_package_config_circle_build_id}""-33383826-gh.circle-artifacts.com/0/tmp/artifacts/dockstore-webservice-1.12.0-beta.1-SNAPSHOT.jar"
else
	JAR_PATH="https://artifacts.oicr.on.ca/artifactory/collab-release/io/dockstore/dockstore-webservice/${npm_package_config_webservice_version}/dockstore-webservice-${npm_package_config_webservice_version}.jar"
fi
echo $JAR_PATH




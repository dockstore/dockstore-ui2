#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

npm ci

if [ "$RUN_PROD" = true ]; then
  ng version
else
  export CHROME_BIN=/usr/bin/google-chrome
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  wget --no-verbose --tries=10 https://artifacts.oicr.on.ca/artifactory/collab-release/io/dockstore/dockstore-webservice/${WEBSERVICE_VERSION}/dockstore-webservice-${WEBSERVICE_VERSION}.jar
  chmod u+x dockstore-webservice-${WEBSERVICE_VERSION}.jar
  sleep 3 # https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI
  ng version
  npm install codecov
fi

wget --no-verbose http://central.maven.org/maven2/org/openapitools/openapi-generator-cli/3.3.1/openapi-generator-cli-3.3.1.jar -O swagger-codegen-cli.jar
java -jar swagger-codegen-cli.jar generate -i https://raw.githubusercontent.com/ga4gh/dockstore/${WEBSERVICE_VERSION}/dockstore-webservice/src/main/resources/swagger.yaml -l typescript-angular -o src/app/shared/swagger -c swagger-config.json

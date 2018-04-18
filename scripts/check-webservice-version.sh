#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace
LATEST_WEBSERVICE=$(curl --silent "https://api.github.com/repos/ga4gh/dockstore/releases/latest" | grep -Po '"tag_name": "\K.*?(?=")')
echo $LATEST_WEBSERVICE
if [ "$LATEST_WEBSERVICE" == "$WEBSERVICE_VERSION" ]
then
  echo "The supplied webservice version is the latest"
else 
  echo "The supplied webservice version is not the latest."
  echo "Latest:" $LATEST_WEBSERVICE
  echo "Current:" $WEBSERVICE_VERSION
fi

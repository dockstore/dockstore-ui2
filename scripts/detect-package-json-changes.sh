#!/bin/bash

npx license-checker  --excludePackages dockstore-ui2@2.3.0 --csv > CIRCLE-THIRD-PARTY-LICENSES.csv
licenseFileStatus="$(diff CIRCLE-THIRD-PARTY-LICENSES.csv THIRD-PARTY-LICENSES.csv)"

if [ -n "$licenseFileStatus" ]
    then
        echo "The THIRD-PARTY-LICENSES.csv file has not been updated. Update the file by running 'npm run license'."
        exit 1
    fi

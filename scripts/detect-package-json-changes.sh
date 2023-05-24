#!/bin/bash

licenseFileStatus="$(diff CIRCLE-THIRD-PARTY-LICENSES.csv THIRD-PARTY-LICENSES.csv)"

if [ -n "$licenseFileStatus" ]
    then
        echo "The THIRD-PARTY-LICENSES.csv file has not been updated. Update the file by running 'npm run license'."
        diff CIRCLE-THIRD-PARTY-LICENSES.csv THIRD-PARTY-LICENSES.csv
        exit 1
    fi

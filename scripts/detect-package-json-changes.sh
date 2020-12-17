#!/bin/bash

packageJsonStatus="$(git diff --name-status develop -- package.json)"
packageLockJsonStatus="$(git diff --name-status develop -- package-lock.json)"

if [ -n "$packageJsonStatus" ] && [ -n "$packageLockJsonStatus" ]
then
    licenseFileStatus="$(git diff --name-status develop -- THIRD-PARTY-LICENSES.csv)"
    if [ -z "$licenseFileStatus" ]
    then
        echo "The package.json and package-lock.json files have changed, but the THIRD-PARTY-LICENSES.csv file has not been updated. Update by running 'npm run license'. Review changes being made before committing and pushing."
        exit 1
    fi
fi

#!/bin/bash


set -o errexit
set -o pipefail
set -o nounset
set -o nounset
#set -o xtrace

# Run pa11y-ci shows any accessibility issues related to the UI.
# This script can be run in two different ways
# 1. NO ARGUMENTS, this will run pa11y-ci twice, the first time it will produce a json result file and the second time it will create a text result file
# 2. WITH THE ARGUMENT "base-branch", this will pa11y-ci against the base branch (as defined in package.json)

OUTPUT_FILE="NOT_SET"
CURRENT_BRANCH_OUTPUT_FILE="current_branch"
BASE_BRANCH_OUTPUT_FILE="base_branch"
if [ "$#" -eq 1 ] && [ "$1" == "base-branch" ]
then
  OUTPUT_FILE=$BASE_BRANCH_OUTPUT_FILE
else
  OUTPUT_FILE=$CURRENT_BRANCH_OUTPUT_FILE
  pa11y-ci > ${OUTPUT_FILE}.txt || true
fi

pa11y-ci --json > ${OUTPUT_FILE}.json || true

cat ${OUTPUT_FILE}.json ${OUTPUT_FILE}.txt

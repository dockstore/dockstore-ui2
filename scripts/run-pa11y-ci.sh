#!/bin/bash


set -o errexit
set -o pipefail
set -o nounset
set -o nounset
#set -o xtrace

# Run pa11y-ci shows any accessibility issues related to the UI.
# This script can be run in two different ways

RESULT_DIRECTORY="accessibility-results"
CURRENT_BRANCH_RESULT_FILE_NAME="current-branch"
BASE_BRANCH_RESULT_FILE_NAME="base-branch"
RESULT_FILE="$CURRENT_BRANCH_RESULT_FILE_NAME"


usage() {
  echo "Usage: $0 [OPTION...]"
  echo ""
  echo "-H, Display help command"
  echo "-B, Do all commands on base-branch (if this option is not given all commands are done on current branch"
  echo "-C, Checkouts the code from the base branch (note: the option -base-branch is not required to do this"
  echo "-R, Runs pa11y-ci on current branch (requires webservice to be running) and outputs results in a form that can be analysed"
  echo "-A, Determines if current branch has more accessibility issues then base branch, requires the results from -run-accessibility-test to be available"
}

# Variables for determining which command to run
RUN_ACCESSIBILITY_TEST="false"
COMPARE_RESULTS="false"

no_args="true"
while getopts 'HBCRA' OPTION; do
  case "$OPTION" in
    H)
      usage
      exit 0
      ;;
    B)
      RESULT_FILE="$BASE_BRANCH_RESULT_FILE_NAME"
      ;;
    C)
      git checkout "$npm_package_config_base_branch"
      echo "The base branch has been checked out, all other flags (if any) have been ignored"
      exit 0
      ;;
    R)
      RUN_ACCESSIBILITY_TEST="true"
      if [ "$COMPARE_RESULTS" == "true" ]
      then
        echo "ERROR: You cannot use the R and A flags at the same time"
        usage
        exit 1
      fi
      ;;
    A)
      COMPARE_RESULTS="true"
      if [ "$RUN_ACCESSIBILITY_TEST" == "true" ]
      then
        echo "ERROR: You cannot use the R and A flags at the same time"
        usage
        exit 1
      fi
      ;;
    ?)
      usage
      exit 1
      ;;
  esac
  no_args="false"
done

if [ "$no_args" == "true" ]
then
  usage
  exit 1
fi

if [ "$RUN_ACCESSIBILITY_TEST" == "true" ]
then
  mkdir -p "$RESULT_DIRECTORY"
  OUTPUT_FILE_PATH="${RESULT_DIRECTORY}/${RESULT_FILE}"
  pa11y-ci --json > "$OUTPUT_FILE_PATH".json || true
  if [ "$RESULT_FILE" == "$CURRENT_BRANCH_RESULT_FILE_NAME" ]
  then
    pa11y-ci 2> "$OUTPUT_FILE_PATH".txt || true # Get nicely formatted version of results
  fi
  echo "Successfully ran accessibility test"
  cat ${OUTPUT_FILE_PATH}.json
  exit 0
fi



if [ "$COMPARE_RESULTS" == "true" ]
then
  ACCESSIBILITY_ERRORS_CURRENT_BRANCH=$(jq .errors "${RESULT_DIRECTORY}/${CURRENT_BRANCH_RESULT_FILE_NAME}".json)
  ACCESSIBILITY_ERRORS_BASE_BRANCH=$(jq .errors "${RESULT_DIRECTORY}/${BASE_BRANCH_RESULT_FILE_NAME}".json)

  echo "Accessibility errors on current branch:"
  cat "${RESULT_DIRECTORY}/${CURRENT_BRANCH_RESULT_FILE_NAME}".txt

  if [ "$ACCESSIBILITY_ERRORS_CURRENT_BRANCH" -gt "$ACCESSIBILITY_ERRORS_BASE_BRANCH" ]; then
    echo "You have introduced $((ACCESSIBILITY_ERRORS_CURRENT_BRANCH-ACCESSIBILITY_ERRORS_BASE_BRANCH)) accessibility errors."
    exit 1
  fi

  # If the number of accessibility errors is equal, then check that if they are the same set of errors.
  if [ "$ACCESSIBILITY_ERRORS_CURRENT_BRANCH" -eq "$ACCESSIBILITY_ERRORS_BASE_BRANCH" ]; then
    echo "The number of accessibility erorrs in this PR and the base branch are the same"
    exit 0
  fi

  echo "You have reduced the number of accessibility issues with this PR"
  exit 0
fi

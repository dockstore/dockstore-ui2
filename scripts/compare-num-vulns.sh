#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

PR_NUM_HIGH_VULNS=$(head -n 1 compare-num-vulnerabilities.txt)
DEV_NUM_HIGH_VULNS=$(sed -n '3p' compare-num-vulnerabilities.txt)

PR_NUM_CRITICAL_VULNS=$(sed -n '2p' compare-num-vulnerabilities.txt)
DEV_NUM_CRITICAL_VULNS=$(sed -n '4p' compare-num-vulnerabilities.txt)

if [ "$PR_NUM_CRITICAL_VULNS" -gt "$DEV_NUM_CRITICAL_VULNS" ]; then
  echo "You have introduced $((PR_NUM_CRITICAL_VULNS-DEV_NUM_CRITICAL_VULNS)) critical vulnerabilities."
  exit 1
fi

if [ "$PR_NUM_HIGH_VULNS" -gt "$DEV_NUM_HIGH_VULNS" ]; then
  echo "You have introduced $((PR_NUM_HIGH_VULNS-DEV_NUM_HIGH_VULNS)) high vulnerabilities."
  exit 1
fi

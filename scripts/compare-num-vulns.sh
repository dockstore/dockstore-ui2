#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

PR_NUM_VULNS=$(head -n 1 compare-num-vulnerabilities.txt)
DEV_NUM_VULNS=$(sed -n '2p' compare-num-vulnerabilities.txt)

if [ "$PR_NUM_VULNS" -gt "$DEV_NUM_VULNS" ]; then
  echo "You have introduced more high vulnerabilities."
  exit 1
  fi

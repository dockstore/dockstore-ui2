#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset


#git checkout develop
#npm audit > vulnerabilities.txt
HIGH_VULN_DEV="$(npm audit | grep -o -i High vulnerabilities.txt | wc -l)"
MED_VULN_DEV="$(grep -o -i High vulnerabilities.txt | wc -l)"
echo $HIGH_VULN_DEV
echo $HIGH_VULN_DEV >> compare-num-vulnerabilities.txt




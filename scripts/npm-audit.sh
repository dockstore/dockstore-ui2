#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

HIGH_VULN_DEV="$(grep -o -i High vulnerabilities.txt | wc -l)"
CRITICAL_VULN_DEV="$(grep -o -i Critical vulnerabilities.txt | wc -l)"

echo $HIGH_VULN_DEV >> compare-num-vulnerabilities.txt
echo $CRITICAL_VULN_DEV >> compare-num-vulnerabilities.txt

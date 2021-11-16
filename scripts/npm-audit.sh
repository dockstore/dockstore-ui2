#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -m

HIGH_VULN_DEV="$(grep -o -i High vulnerabilities.txt | wc -l)"
echo $HIGH_VULN_DEV
echo $HIGH_VULN_DEV >> compare-num-vulnerabilities.txt




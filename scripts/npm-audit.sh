#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

HIGH_VULN_DEV="$(grep -o High vulnerabilities.txt | wc -l || true)"
CRITICAL_VULN_DEV="$(grep -o Critical vulnerabilities.txt | wc -l || true)"

echo $HIGH_VULN_DEV >> compare-num-vulnerabilities.txt
echo $CRITICAL_VULN_DEV >> compare-num-vulnerabilities.txt

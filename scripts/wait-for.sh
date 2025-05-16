#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace
wget --output-document /dev/null --waitretry=100 --tries=200 --retry-connrefused localhost:4200 || true
wget --output-document /dev/null --waitretry=100 --tries=200 --retry-connrefused localhost:8080 || true
wget --output-document /dev/null --waitretry=100 --tries=200 --retry-connrefused localhost:9200 || true


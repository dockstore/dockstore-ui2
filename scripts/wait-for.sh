#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace
until wget --output-document /dev/null --waitretry=100 localhost:4200 ; do sleep 60 ; done
until wget --output-document /dev/null --waitretry=100 localhost:8080 ; do sleep 60 ; done
until wget --output-document /dev/null --waitretry=100 localhost:9200 ; do sleep 60 ; done


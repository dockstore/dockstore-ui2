#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace
until $(curl --output /dev/null --silent --head localhost:4200); do
    sleep 5
done
until $(curl --output /dev/null --silent --head localhost:8080); do
    sleep 5
done

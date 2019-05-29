#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

npm run webservice
npm run build
npm run start &
./scripts/wait-for.sh
npx cypress run --record --config defaultCommandTimeout=10000 --spec ${TEST}

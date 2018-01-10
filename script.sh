#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

sed -i 's/-//g' src/app/shared/swagger/model/toolV1.ts && sed -i 's/-//g' src/app/shared/swagger/model/toolVersionV1.ts && sed -i 's/-//g' src/app/shared/swagger/model/metadataV1.ts
ORIGINAL="const jsonMime: RegExp = new RegExp('(?i)^(application/json|\[^;/ \\\t\]+/\[^;/ \\\t\]+\[+\]json)\[ \\\t\]\*(;\.\*)?$');"
NEW="const jsonMime: RegExp = new RegExp('(application/json|\[^;/ \\\t\]+/\[^;/ \\\t\]+\[+\]json)\[ \\\t\]\*(;\.\*)?$', 'i');"
for i in src/app/shared/swagger/api/*; do
  sed -i "s~$ORIGINAL~$NEW~g" $i
done

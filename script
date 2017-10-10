#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

sed -i 's/-//g' src/app/shared/swagger/model/tool.ts && sed -i 's/-//g' src/app/shared/swagger/model/toolVersion.ts && sed -i 's/-//g' src/app/shared/swagger/model/metadata.ts
sed -i "s/let headers = new Headers(this\.defaultHeaders\.toJSON());/let headers = new Headers(this\.defaultHeaders\.toJSON()); headers\.set('Authorization', 'Bearer ' + this\.configuration\.accessToken);/g" src/app/shared/swagger/api/users.service.ts
sed -i "s/let headers = new Headers(this\.defaultHeaders\.toJSON());/let headers = new Headers(this\.defaultHeaders\.toJSON()); headers\.set('Authorization', 'Bearer ' + this\.configuration\.accessToken);/g" src/app/shared/swagger/api/containertags.service.ts
sed -i "s/let headers = new Headers(this\.defaultHeaders\.toJSON());/let headers = new Headers(this\.defaultHeaders\.toJSON()); headers\.set('Authorization', 'Bearer ' + this\.configuration\.accessToken);/g" src/app/shared/swagger/api/workflows.service.ts
sed -i "s/let headers = new Headers(this\.defaultHeaders\.toJSON());/let headers = new Headers(this\.defaultHeaders\.toJSON()); headers\.set('Authorization', 'Bearer ' + this\.configuration\.accessToken);/g" src/app/shared/swagger/api/containers.service.ts
sed -i "s/let headers = new Headers(this\.defaultHeaders\.toJSON());/let headers = new Headers(this\.defaultHeaders\.toJSON()); headers\.set('Authorization', 'Bearer ' + this\.configuration\.accessToken);/g" src/app/shared/swagger/api/tokens.service.ts
ORIGINAL="const jsonMime: RegExp = new RegExp('(?i)^(application/json|\[^;/ \\\t\]+/\[^;/ \\\t\]+\[+\]json)\[ \\\t\]\*(;\.\*)?$');"
NEW="const jsonMime: RegExp = new RegExp('(application/json|\[^;/ \\\t\]+/\[^;/ \\\t\]+\[+\]json)\[ \\\t\]\*(;\.\*)?$', 'i');"
for i in src/app/shared/swagger/api/*; do
  sed -i "s~$ORIGINAL~$NEW~g" $i
done

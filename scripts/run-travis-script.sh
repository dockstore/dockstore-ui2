#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

psql -c "create user dockstore with password 'dockstore' createdb;" -U postgres
psql -c "ALTER USER dockstore WITH superuser;" -U postgres
psql -c 'create database webservice_test with owner = dockstore;' -U postgres
psql -f travisci/db_dump.sql webservice_test
java -jar dockstore-webservice-${WEBSERVICE_VERSION}.jar db migrate -i 1.5.0,1.6.0 travisci/web.yml
java -jar dockstore-webservice-${WEBSERVICE_VERSION}.jar server travisci/web.yml 1>/dev/null &
sleep 20

npm run build
ng serve --progress=false &
./scripts/wait-for.sh
cypress run --record --config defaultCommandTimeout=10000 --spec ${TEST}

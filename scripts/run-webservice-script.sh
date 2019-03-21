#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

wget --no-verbose --tries=10 https://artifacts.oicr.on.ca/artifactory/collab-release/io/dockstore/dockstore-webservice/${npm_package_wsv}/dockstore-webservice-${npm_package_wsv}.jar
chmod u+x dockstore-webservice-${npm_package_wsv}.jar
psql -c "create user dockstore with password 'dockstore' createdb;" -U postgres
psql -c "ALTER USER dockstore WITH superuser;" -U postgres
psql -c 'create database webservice_test with owner = dockstore;' -U postgres
psql -f travisci/db_dump.sql webservice_test
java -jar dockstore-webservice-${npm_package_wsv}.jar db migrate -i 1.5.0,1.6.0 travisci/web.yml
java -jar dockstore-webservice-${npm_package_wsv}.jar server travisci/web.yml 1>/dev/null &


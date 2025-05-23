[![Codacy Badge](https://app.codacy.com/project/badge/Grade/37aa92c1fff9407fb47b426d1be1f7f0)](https://www.codacy.com/gh/dockstore/dockstore-ui2/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dockstore/dockstore-ui2&amp;utm_campaign=Badge_Grade)
[![CircleCI](https://circleci.com/gh/dockstore/dockstore-ui2/tree/develop.svg?style=svg)](https://circleci.com/gh/dockstore/dockstore-ui2/tree/develop)
[![codecov](https://codecov.io/gh/dockstore/dockstore-ui2/branch/develop/graph/badge.svg)](https://codecov.io/gh/dockstore/dockstore-ui2)

Please file issues for this repository and Web site at [the dockstore/dockstore repository](https://github.com/dockstore/dockstore/issues)!

Table of Contents
=================

   * [DockstoreUi2](#dockstoreui2)
      * [Set Up Angular CLI](#set-up-angular-cli)
         * [Prerequisites](#prerequisites)
            * [NPM](#npm)
      * [Project Set Up](#project-set-up)
      * [Development server](#development-server)
      * [Code scaffolding](#code-scaffolding)
      * [Build](#build)
      * [Running unit tests](#running-unit-tests)
      * [Running end-to-end tests](#running-end-to-end-tests)
      * [Further help](#further-help)


# Dockstore UI2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.4.

## Set Up Angular CLI

### Prerequisites

- Java 17+
- Node and its included NPM (see [.nvmrc](.nvmrc) for the correct version of node to install)
- wget 

Install NPM and Node using nvm:
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
Close current terminal and open a new one or `source ~/.bashrc`
```
nvm install $(cat .nvmrc)
```
Optionally, install a global Angular CLI in order to execute `ng` commands without prepending `npx`.   
Otherwise, prepend `npx` to every command in this README if a global @angular/cli was not installed.
Before installing, follow https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-two-change-npms-default-directory to fix permissions if needed.

```
$npm i -g @angular/cli@14.2.8		
```

#### NPM

After cloning the repo from GitHub, you can install the npm packages.
```
git clone https://github.com/dockstore/dockstore-ui2.git
cd dockstore-ui2
git checkout develop
git pull

npm ci
```
`npm ci` will install all npm dependencies including Prettier and the Husky Git hook. 
Ensure `CI=true` is not set when using `npm ci` or else the Git hook will not work.
Prettier + Husky will automatically format changed files before each commit:
```
$ git commit -m "Test"
ghusky > pre-commit (node v10.13.0)
  ↓ Stashing changes... [skipped]
    → No partially staged files found...
  ✔ Running linters...
[feature/2130/prettier b6da3e7c] Test
```


Check to make sure Angular CLI has been properly set up
```
 ng v

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 14.2.7
Node: 16.18.1
Package Manager: npm 8.19.2 
OS: darwin arm64

Angular: 14.2.8
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1402.7
@angular-devkit/build-angular   14.2.7
@angular-devkit/core            14.2.7
@angular-devkit/schematics      14.2.7
@angular/cdk                    14.2.6
@angular/cli                    14.2.7
@angular/flex-layout            14.0.0-beta.41
@angular/material               14.2.6
@schematics/angular             14.2.7
rxjs                            6.6.7
typescript                      4.8.4
```

If you wish to serve the dist folder in a VM, make sure you have nginx and security rules set up properly.
[Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

## Project Set Up

The Dockstore class in [src/app/shared/dockstore.model.ts](src/app/shared/dockstore.model.ts) is for integrating supported services.

In `dockstore-webservice`, the `dockstore.yml` being served <b>must be edited to include the client IDs</b>.

## Development server

Run `npm run start -- --host=<host>` for a dev server. Navigate to `http://<host>:4200/`. The app will automatically reload if you change any of the source files. 

## Updating dependencies

Run `npm update`. This will automatically update package.json and package-lock.json.

When you update a dependency in the package.json, make sure to update the third party licenses file `THIRD-PARTY-LICENSES.csv`. 
To update this file, run `npm run license`. Unfortunately, there is not a way to permanently say a certain dependency should be x license using this package. 
So, once we manually update a dependency's license info and we continue to use it, running the above command will always result in it being unknown in the 
updated file. **Be sure to review the updated file (i.e. revert changes as needed and update any new unknown or unlicensed dependencies).**

For more documentation on license-checker, visit [here](https://github.com/davglass/license-checker)

## Code scaffolding

Run `ng g component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.  See https://github.com/datorama/akita-schematics#create-a-new-feature for how to generate Akita-related components.

## Build

When building against artifactory, the build should use the latest SNAPSHOT. In this scenario, the package.json will look like
```
 "config": {
    "webservice_version_prefix": "1.17.0",
    "webservice_version": "1.17.0-alpha.10",
    "use_snapshot": true
```

Optionally override the webservice version using `npm config set dockstore-ui2:webservice_version ${WEBSERVICE_VERSION}`

For example, to build against a specific branch, edit the package.json with
```
  "config": {
    "webservice_version_prefix": "1.16.0",
    "webservice_version": "feature/seab-6420/modify-endpoint-description-for-new-health-checks",
    "use_snapshot": false
  },
```
For example, to build against a specific commit, edit the package.json with
```
  "config": {
    "webservice_version_prefix": "1.16.0",
    "webservice_version": "1550b549c45b2f4ba7f205e2f64502d523417dcd",
    "use_snapshot": false
  },
```

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. 

### Angular Production Build

For an Angular Production Build, you will need to install Nginx. 
Replace your nginx.conf file (location depends on your installation) with this template, filling in the two paths: 
```
events {
}
http {
  include       /usr/local/etc/nginx/mime.types;
  server {
    listen 4200;
      location = /swagger.json {
        proxy_pass  http://localhost:8080/swagger.json;
      }
    location /api/ {
          rewrite ^ $request_uri;
          rewrite ^/api/(.*) $1 break;
          return 400;
          proxy_pass     http://localhost:8080/$uri;
    }
    location / {
        root  /<path to>/dockstore-ui2/dist; # FILL IN
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
  }
  server {
    listen 5200;
    location / {
        root  /<path to>/dockstore-ui2/dist; # FILL IN
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            #
            # Custom headers and headers various browsers *should* be OK with but aren't
            #
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            #
            # Tell client that this pre-flight info is valid for 20 days
            #
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
         }
         if ($request_method = 'POST') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
         }
         if ($request_method = 'GET') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
         }
      }
    }
}
```
Use `npm run build.prod` for an Angular Production Build and start it with `nginx`. localhost:4200 should be available immediately.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Cypress is no longer specified in the package.json, check the `.circleci/config.yml` for the version and how to install it.

Run `npx cypress open` or `npx cypress run` to execute the end-to-end tests via Cypress.io.
Before running the tests make sure you:
- have a postgresql database
- serve the app via `ng serve` or similar.
- have the Dockstore webservice jar in the root directory and run it (see scripts/run-webservice-script.sh for guideline)

### Running smoke tests
Smoke tests are part of the end-to-end testing suite and are located under `cypress/integration/smokeTests/`. The smoke tests
can be executed alongside other integration tests when running `npx cypress open` or `npx cypress run`.

Various sets of smoke tests are runnable from scripts in `package.json`. To run smoke tests against your local service,
run `npm run test-local-no-auth`. Before running the tests make sure you have Dockstore set up locally, as described in the above section.

`npm run test-local-no-auth` is also executed in CircleCI when a branch is pushed, or a pull request is made. When run on CircleCI,
the smoke tests leverage a dummy database stored in `test/smoke_test_db.sql`. If a smoke test fails on CircleCI, there are two main scenarios
to consider:
1. The smoke tests are failing due to a change in the UI. This can be fixed by modifying the tests in `cypress/integration/smokeTests/`.
2. The dummy smoke test database does not have the proper data for the tested version of the UI. This can be fixed by modifying the data in `test/smoke_test_db.sql`.

#### Modifying the smoke test database
*Note: Do not link any real accounts in the smoke test database as that will add tokens to the database dump, which is publicly visible. 
This means you cannot register an account in the normal fashion, as that will add either a GitHub or Google token to the database.* 

To modify the smoke test database, `test/smoke_test_db.sql`:
1. Load `test/smoke_test_db.sql` into your postgres database.
2. Run Dockstore locally.
3. Login to one of the test users already in the database by setting the browser `ng2-ui-auth_token` 
to `fake-admin-token`, `fake-curator-token` or `fake-basic-1-token`. Then, refresh the page. (To locate `ng2-ui-auth_token` in chrome, 
go to developer tools -> application -> storage (on the left snackbar) -> local storage -> http://localhost:4200)
4. Make any desired changes to the database, preferably via the UI. It's not recommended to manually change the smoke test database with SQL commands, 
as this can cause constraint issues, but in some cases it is required.
5. Create a new database dump for the content in postgres, for example if postgres is running in a Docker container, execute: 
`docker exec -t postgres1 pg_dump -U postgres --column-inserts webservice_test > smoke_test_db.sql`
6. Verify the database dump doesn't have any live tokens in the tokens table 
(Search for `Data for Name: token; Type: TABLE DATA; Schema: public; Owner: dockstore`), then commit the new database dump.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/58c43301d4b84c8ab74bdbeb2a962973)](https://app.codacy.com/app/dockstore/dockstore-ui2?utm_source=github.com&utm_medium=referral&utm_content=dockstore/dockstore-ui2&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/dockstore/dockstore-ui2.svg?branch=develop)](https://travis-ci.org/dockstore/dockstore-ui2)
[![codecov](https://codecov.io/gh/dockstore/dockstore-ui2/branch/develop/graph/badge.svg)](https://codecov.io/gh/dockstore/dockstore-ui2)

Please file issues for this repository and Web site at [the ga4gh/dockstore repository](https://github.com/ga4gh/dockstore/issues)!

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

Angular CLI requires Node and NPM.  See [.travis.yml](.travis.yml) for the correct versions of Node, NPM and Angular CLI.
Then make sure Angular CLI has been properly set up.

[Install NPM and Node](https://nodejs.org/en/download/package-manager/)
```
$curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$sudo apt-get install -y nodejs
$nodejs -v
v7.10.0
$npm -v
4.2.0
```
Follow https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-two-change-npms-default-directory to fix permissions and then...

```
$npm i -g @angular/cli@1.3.1		
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

Check to make sure Angular CLI has been properly set up
```
$ ng v
    _                      _                 ____ _     ___
   / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
  / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
 / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
/_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
               |___/
@angular/cli: 1.3.1
node: 7.9.0
os: linux x64
@angular/animations: 4.3.6
@angular/common: 4.3.6
@angular/compiler: 4.3.6
@angular/core: 4.3.6
@angular/flex-layout: 2.0.0-beta.9
@angular/forms: 4.3.6
@angular/http: 4.3.6
@angular/platform-browser: 4.3.6
@angular/platform-browser-dynamic: 4.3.6
@angular/router: 4.3.6
@angular/cli: 1.3.1
@angular/compiler-cli: 4.3.6
@angular/language-service: 4.3.6
```

If you wish to serve the dist folder in a VM, make sure you have nginx and security rules set up properly.
[Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

## Project Set Up

The Dockstore class in [src/app/shared/dockstore.model.ts](src/app/shared/dockstore.model.ts) is for integrating supported services.

In `dockstore-webservice`, the `dockstore.yml` being served <b>must be edited to include the client IDs</b>.

## Pre-build/serve
<!-- 
  Possible bash command
  export WEBSERVICE_VERSION=`grep -oP 'WEBSERVICE_VERSION="\K[0-9].[0-9].[0-9]' .travis.yml`
-->
Run `export WEBSERVICE_VERSION=`[dockstore release version](https://github.com/dockstore/dockstore-ui2/blob/develop/.travis.yml#L12), for example `export WEBSERVICE_VERSION=1.5.3`.

Run `npm run prebuild` before running or building the project. This command will:
- generate a file which contains the UI tag version 
- download the openapi codegen
- generate code from the swagger.yaml

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Run `ng serve --host 0.0.0.0` in order to serve your site to other computers on the same network. 


## Updating dependencies

Run `npm update`. This will automatically update package.json and package-lock.json.

## Code scaffolding

Run `ng g component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.  See https://github.com/datorama/akita-schematics#create-a-new-feature for how to generate Akita-related components.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `$(npm bin)/cypress open` or `$(npm bin)/cypress run` to execute the end-to-end tests via Cypress.io.
Before running the tests make sure you:
- serve the app via `ng serve`.
- run the Dockstore webservice
- have a webservice jar in the root directory

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

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


# DockstoreUi2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.4.

## Set Up Angular CLI

### Prerequisites

Angular CLI requires Node 6.9.0 or higher, together with NPM 3 or higher.
Then make sure Angular CLI has been properly set up.

[Install NPM and Node](https://nodejs.org/en/download/package-manager/)
```
$curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$sudo apt-get install -y nodejs
$nodejs -v
v7.10.0
$npm -v
4.2.0

$sudo npm install -g @angular/cli@1.3.1		
```

#### NPM

After cloning the repo from GitHub, you can install the npm packages.
```
git clone https://github.com/dockstore/dockstore-ui2.git
cd dockstore-ui2
git checkout develop
git pull

npm install
```

Check to make sure Angular CLI has been properly set up
```
$ ng -v
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

## Swagger

You will need to generate the Dockstore client classes (version numbers may change frequently).
Look at the setup in the [travis.yml](.travis.yml)

## Project Set Up

The Dockstore class in `dockstore-ui2/src/app/shared/dockstore.model.ts` is for integrating supported services.

In `dockstore-webservice`, the `dockstore.yml` being served <b>must be edited to include the client IDs</b>.

## Pre-build/serve

Run `npm run-script prebuild` before running or building the project. This command will automatically generate a file which contains the UI tag version.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Run `ng serve --host 0.0.0.0` in order to serve your site to other computers on the same network. 


## Updating dependencies

Run `npm shrinkwrap`. Note that due to a problem with angular-tag-cloud, you will need to manually edit its dependencies in the file node\_modules/angular-tag-cloud-module/package.json . 
Change its peer dependency to 4.3.6.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

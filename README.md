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

- Java 8+ 
- Node and its included NPM (see [.nvmrc](.nvmrc) for the correct version of node to install)
- wget 

Install NPM and Node using nvm:
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
Close current terminal and open a new one or `source ~/.bashrc`
```
nvm install 10.13.0
```
Optionally, install a global Angular CLI in order to execute `ng` commands without prepending `npx`.   
Otherwise, prepend `npx` to every command in this README if a global @angular/cli was not installed.
Before installing, follow https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-two-change-npms-default-directory to fix permissions if needed.

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

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Run `ng serve --host 0.0.0.0` in order to serve your site to other computers on the same network. 


## Updating dependencies

Run `npm update`. This will automatically update package.json and package-lock.json.

## Code scaffolding

Run `ng g component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.  See https://github.com/datorama/akita-schematics#create-a-new-feature for how to generate Akita-related components.

## Build

Optionally override the webservice version using `npm config set dockstore-ui2:webservice_version ${WEBSERVICE_VERSION}`
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `npm run build.prod` for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Cypress is no longer specified in the package.json, check the `.circleci/config.yml` for the version and how to install it.

Run `$(npm bin)/cypress open` or `$(npm bin)/cypress run` to execute the end-to-end tests via Cypress.io.
Before running the tests make sure you:
- have a postgresql database
- serve the app via `ng serve` or similar.
- have the Dockstore webservice jar in the root directory and run it (see scripts/run-webservice-script.sh for guideline)

## Documentation Generation

This should eventually be done automatically on the master branch and have GitHub pages point to the docs folder.
To manually run it:
```
npm install -g @compodoc/compodoc
npm run compodoc
```
Then open `docs/index.html` with browser

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

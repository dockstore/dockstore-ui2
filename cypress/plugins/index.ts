const path = require('path');
const { execFileSync } = require('child_process');
const fs = require('fs');

// Set the following variable to an appropriate value for your postgres setup.
const psqlArgs = ['-h', 'localhost', 'webservice_test', '-U', 'dockstore'];
const execOptions = { env: { ...process.env, PASSWORD: 'dockstore' }, stdio: 'pipe' };

function psql(extraArgs, input) {
  execFileSync('psql', [...psqlArgs, ...extraArgs], { ...execOptions, input });
  return null;
}

function webservice(args) {
  execFileSync('java', ['-jar', 'dockstore-webservice.jar', ...args], execOptions);
}

module.exports = (on, config) => {
  const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor');
  const webpackOptions = webpackPreprocessor.defaultOptions.webpackOptions;

  // The Angular linker plugin requires Babel ^8, but the babel-loader that hoists to the
  // root node_modules only supports Babel 7. @angular-devkit/build-angular already bundles
  // a compatible babel-loader + @babel/core@8 pair, so resolve through it instead.
  const babelLoaderPath = require.resolve('babel-loader', {
    paths: [path.dirname(require.resolve('@angular-devkit/build-angular/package.json'))],
  });

  webpackOptions.module.rules.unshift({
    test: /[/\\]@angular[/\\].+\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
    use: {
      loader: babelLoaderPath,
      options: {
        plugins: ['@angular/compiler-cli/linker/babel'],
        compact: false,
        cacheDirectory: true,
      },
    },
  });

  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions: webpackOptions,
      typescript: require.resolve('typescript'),
    })
  );

  // cy.exec() was removed in Cypress 16, so shell/database work goes through tasks, which run in Node
  on('task', {
    resetDb: (migrations) => {
      webservice(['db', 'drop-all', '--confirm-delete-everything', 'test/web.yml']);
      psql([], fs.readFileSync('test/db_dump.sql'));
      webservice(['db', 'migrate', '-i', migrations, 'test/web.yml']);
      return null;
    },
    psqlFile: (fileName) => psql([], fs.readFileSync(fileName)),
    psqlCommand: (sqlStatement) => psql(['-c', sqlStatement]),
  });

  return config;
};

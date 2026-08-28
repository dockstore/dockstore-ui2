const path = require('path');

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

  return config;
};

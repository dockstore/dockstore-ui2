module.exports = (on, config) => {
  const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor');
  const webpackOptions = webpackPreprocessor.defaultOptions.webpackOptions;

  webpackOptions.module.rules.unshift({
    test: /[/\\]@angular[/\\].+\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
    use: {
      loader: 'babel-loader',
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

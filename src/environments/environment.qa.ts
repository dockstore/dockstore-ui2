// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=qa` then `environment.qa.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// This is for Travis

export const environment = {
  production: true,
  HOSTNAME: 'http://localhost',
  API_PORT: '8080',
  UI_PORT: '4200',
  UI1_PORT: '9000',

  GITHUB_CLIENT_ID: 'maybe fill this in',
  QUAYIO_CLIENT_ID: 'maybe fill this in',
  BITBUCKET_CLIENT_ID: 'maybe fill this in',
  GITLAB_CLIENT_ID: 'maybe fill this in',
};

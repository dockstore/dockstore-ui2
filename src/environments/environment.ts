// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// This is for development, do not commit

export const environment = {
  production: false,
  HOSTNAME: 'http://##.##.##.## change this to your own IP',
  API_PORT: '8080 change this to your own port',
  UI_PORT: '4200 change this to your own port',
  UI1_PORT: '9000 change this to your own port',

  GITHUB_CLIENT_ID: 'fill this in with your own',
  QUAYIO_CLIENT_ID: 'fill this in with your own',
  BITBUCKET_CLIENT_ID: 'fill this in with your own',
  GITLAB_CLIENT_ID: 'fill this in with your own',
};

// This enum is unrelated to the webservice endpoints since the webservice calls are swagger generated
export enum Provider {
  GITHUB = 'github.com', // This does not need to match anything
  QUAY = 'quay.io', // this does not need to match anything, it can be whatever
  BITBUCKET = 'bitbucket.org', // This can be anything as long as it matches the redirect URI on bitbucket
  GITLAB = 'gitlab.com', // This must match the redirect URL in the dockstore.yml and GitLab authorized applications
  ZENODO = 'zenodo.org',
  ORCID = 'orcid.org'
}

export enum Provider {
    GITHUB = 'chicken', // This does not need to match anything
    QUAY = 'pork', // this does not need to match anything, it can be whatever
    BITBUCKET = 'salmon', // This can be anything as long as it matches the redirect URI on bitbucket
    GITLAB = 'beef' // This must match the redirect URL in the dockstore.yml and GitLab authorized applications
}

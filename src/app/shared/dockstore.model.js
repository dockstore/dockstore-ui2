"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dockstore = (function () {
    function Dockstore() {
    }
    return Dockstore;
}());
Dockstore.API_URI = 'http://localhost:8080';
Dockstore.GITHUB_CLIENT_ID = 'fill this in';
Dockstore.GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
Dockstore.GITHUB_REDIRECT_URI = 'http://fill this in:4200/auth/tokens/github';
Dockstore.GITHUB_SCOPE = 'user,user:email';
Dockstore.QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
Dockstore.QUAYIO_REDIRECT_URI = 'http://fill this in:4200/auth/quay';
Dockstore.QUAYIO_SCOPE = 'repo:read,user:read';
Dockstore.QUAYIO_CLIENT_ID = 'fill this in';
Dockstore.BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
Dockstore.BITBUCKET_CLIENT_ID = 'fill this in';
Dockstore.GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
Dockstore.GITLAB_CLIENT_ID = 'fill this in';
Dockstore.GITLAB_REDIRECT_URI = 'http://fill this in:4200/auth/gitlab';
exports.Dockstore = Dockstore;

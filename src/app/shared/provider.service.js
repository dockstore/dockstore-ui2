"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderService = (function () {
    function ProviderService() {
    }
    /* set up project provider */
    ProviderService.prototype.setUpProvider = function (tool) {
        var gitUrl = tool.gitUrl;
        tool.provider = this.getProvider(gitUrl);
        tool.providerUrl = this.getProviderUrl(gitUrl, tool.provider);
        return tool;
    };
    // TODO: Without an anchor, this looks fragile (for example if you had a github repo that included the string " bitbucket.org" in its name.
    ProviderService.prototype.getProvider = function (gitUrl) {
        if (gitUrl.includes('github.com')) {
            return 'GitHub';
        }
        if (gitUrl.includes('bitbucket.org')) {
            return 'Bitbucket';
        }
        if (gitUrl.includes('gitlab.com')) {
            return 'GitLab';
        }
        return null;
    };
    ProviderService.prototype.getProviderUrl = function (gitUrl, provider) {
        if (!gitUrl) {
            return null;
        }
        var gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
        var matchRes = gitUrlRegExp.exec(gitUrl);
        if (!matchRes) {
            return null;
        }
        var providerUrl = '';
        switch (provider) {
            case 'GitHub':
                providerUrl = 'https://github.com/';
                break;
            case 'Bitbucket':
                providerUrl = 'https://bitbucket.org/';
                break;
            case 'GitLab':
                providerUrl = 'https://gitlab.com/';
                break;
            default:
                return null;
        }
        providerUrl += matchRes[1] + '/' + matchRes[2];
        return providerUrl;
    };
    return ProviderService;
}());
exports.ProviderService = ProviderService;

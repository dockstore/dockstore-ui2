export class ProviderService {

  /* set up project provider */
  setUpProvider(tool) {
    console.log(tool.gitUrl);
    const gitUrl = tool.gitUrl;

    tool.provider = this.getProvider(gitUrl);
    console.log(tool.provider);
    tool.providerUrl = this.getProviderUrl(gitUrl, tool.provider);
    console.log(tool.providerUrl);
    return tool;
  }

// TODO: Without an anchor, this looks fragile (for example if you had a github repo that included the string " bitbucket.org" in its name.
  private getProvider(gitUrl: string): string {
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
  }

  private getProviderUrl(gitUrl: string, provider: string): string {
      if (!gitUrl) {
        return null;
      }

      const gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
      const matchRes = gitUrlRegExp.exec(gitUrl);

      if (!matchRes) {
        return null;
      }

      let providerUrl = '';

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
  }

}

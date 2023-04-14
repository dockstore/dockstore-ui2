import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baseUrl',
})
export class BaseUrlPipe implements PipeTransform {
  /**
   * Constructs a base url for relative links in markdown README files.
   * @param providerUrl
   * @param versionName
   * @param customPath If applicable, the relative path of markdown file if its parent directory is not the root of the repo. Ex. custom readMePath defined in .dockstore.yml
   * @returns {string} base url to be used by ngx-markdown
   */
  transform(providerUrl: string, versionName: string, customPath?: string | null): string {
    let markdownBasePath: string;
    if (!providerUrl || !versionName) {
      console.error('providerUrl or versionName is not truthy');
      return null;
    }

    if (customPath) {
      const slashIndex = customPath.lastIndexOf('/'); //index of the slash before the readme filename. This allows us to get the path to its parent directory.
      markdownBasePath = customPath.substring(0, slashIndex) + '/'; // the last slash is needed by ngx-markdown
    } else {
      markdownBasePath = '/';
    }

    if (providerUrl.startsWith('https://github.com/') || providerUrl.startsWith('https://gitlab.com/')) {
      return providerUrl + '/blob/' + versionName + markdownBasePath; // the last slash needed by ngx-markdown is provided by markdownBasePath.
    } else if (providerUrl.startsWith('https://bitbucket.org/')) {
      return providerUrl + '/src/' + versionName + markdownBasePath; //  the last slash needed by ngx-markdown is provided by markdownBasePath.
    } else {
      return null;
    }
  }
}

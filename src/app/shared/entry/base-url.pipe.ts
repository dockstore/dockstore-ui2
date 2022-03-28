import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baseUrl',
})
export class BaseUrlPipe implements PipeTransform {
  /**
   * Constructs a base url for relative links in markdown README files.
   * @param providerUrl
   * @param versionName
   * @returns {string} base url to be used by ngx-markdown
   */
  transform(providerUrl: string, versionName: string): string {
    if (!providerUrl || !versionName) {
      console.error('providerUrl or versionName is not truthy');
      return null;
    }
    if (providerUrl.startsWith('https://github.com/') || providerUrl.startsWith('https://gitlab.com/')) {
      return providerUrl + '/blob/' + versionName + '/'; // the last slash is needed by ngx-markdown
    } else if (providerUrl.startsWith('https://bitbucket.org/')) {
      return providerUrl + '/src/' + versionName + '/'; // the last slash is needed by ngx-markdown
    } else {
      return null;
    }
  }
}

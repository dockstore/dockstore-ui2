import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baseUrl',
})
export class BaseUrlPipe implements PipeTransform {
  private readMeBasePath: string;
  /**
   * Constructs a base url for relative links in markdown README files.
   * @param providerUrl
   * @param versionName
   * @returns {string} base url to be used by ngx-markdown
   */
  transform(providerUrl: string, versionName: string, readMePath: string): string {
    if (!providerUrl || !versionName) {
      console.error('providerUrl or versionName is not truthy');
      return null;
    }
    console.log(readMePath);
    if (readMePath) {
      const slashIndex = readMePath.lastIndexOf('/'); //index of the slash before the readme filename. This allows us to get the path to its parent directory.
      this.readMeBasePath = readMePath.substring(0, slashIndex) + '/'; // the last slash is needed by ngx-markdown
    } else {
      this.readMeBasePath = '';
    }

    if (providerUrl.startsWith('https://github.com/') || providerUrl.startsWith('https://gitlab.com/')) {
      return providerUrl + '/blob/' + versionName + '/' + this.readMeBasePath; // the last slash needed by ngx-markdown is provided by this.readMeBasePath.
    } else if (providerUrl.startsWith('https://bitbucket.org/')) {
      return providerUrl + '/src/' + versionName + '/' + this.readMeBasePath; //  the last slash needed by ngx-markdown is provided by this.readMeBasePath.
    } else {
      return null;
    }
  }
}

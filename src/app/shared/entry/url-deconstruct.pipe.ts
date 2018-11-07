import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlDeconstruct'
})
export class UrlDeconstructPipe implements PipeTransform {
  /**
   * Pipe for deconstructing URLs, represented as string objects, into just the important information.
   * E.g. https://github.com/agduncan94/hello-dockstore-workflow should be shortened to agduncan94/hello-dockstore-workflow
   *
   * @param providerUrl
   * @param versionName
   * @returns {string} The pathname of providerUrl
   */

  transform(providerUrl: string, versionName: string): string {
    const PATHNAME = 1;
    providerUrl = providerUrl.split(/:\/\//).pop();     // Removes protocol from providerUrl

    if (providerUrl.startsWith('github.com') && versionName) {
      return providerUrl.replace('github.com/', '') + '/tree/' + versionName;
    }
    if (providerUrl.startsWith('bitbucket.org') && versionName) {
      return providerUrl.replace('bitbucket.org/', '') + '/src/' + versionName;
    }
    if (providerUrl.startsWith('gitlab.com') && versionName) {
      return providerUrl.replace('gitlab.com/', '') + '/tree/' + versionName;
    }
    if (providerUrl.startsWith('quay.io')) {
      return providerUrl.replace('quay.io/repository/', '');
    }
    if (providerUrl.startsWith('hub.docker.com')) {
      return providerUrl.replace('hub.docker.com/r/', '');
    }
    // Return the url starting from its pathname
    return providerUrl.split('/').slice(PATHNAME).join('/');
  }
}

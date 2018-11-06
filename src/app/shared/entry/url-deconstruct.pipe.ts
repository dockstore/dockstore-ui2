/**
 * Pipe for deconstructing URLs, represented as string objects, into just the important information.
 *
 * E.G. https://github.com/agduncan94/hello-dockstore-workflow should be shortened to agduncan94/hello-dockstore-workflow
 *
 * @param {string}    providerUrl
 * @param {string}    versionName
 *
 * @return {string}   The pathname of providerUrl
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlDeconstruct'
})
export class UrlDeconstructPipe implements PipeTransform {

  transform(providerUrl: string, versionName: string): any {
    const PATHNAME = 3;

    if (providerUrl.includes('github.com') && versionName) {
      return providerUrl.split('github.com/').pop() + '/tree/' + versionName;
    }
    if (providerUrl.includes('bitbucket.org') && versionName) {
      return providerUrl.split('bitbucket.org/').pop() + '/src/' + versionName;
    }
    if (providerUrl.includes('quay.io')) {
      return providerUrl.split('/repository/').pop();
    }
    if (providerUrl.includes('hub.docker.com')) {
      return providerUrl.split('/r/').pop();
    }
    // Return the url starting from its pathname
    return providerUrl.split('/').slice(PATHNAME).join('/');
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlDeconstruct',
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
    const re = /^(https?:)?\/\/(www\.)?([\w-.]+\.com|[\w-.]+\.org|[\w-.]+\.io)(\/[\w-.]+)?\/([\w-.]+)\/([\w-.]+)$/;

    const WEBSITE = 3;
    const USERNAME = 5;
    const REPONAME = 6;

    const split = providerUrl.match(re);

    if (split && versionName) {
      return `${split[WEBSITE]}/${split[USERNAME]}/${split[REPONAME]}:${versionName}`;
    }
    if (split) {
      return `${split[WEBSITE]}/${split[USERNAME]}/${split[REPONAME]}`;
    }
    return providerUrl.split(/https?:\/\//).pop();
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Dockstore } from '../dockstore.model';

@Pipe({
  name: 'zenodoAccessLink',
  standalone: true,
})
export class ZenodoAccessLinkPipe implements PipeTransform {
  /**
   * Constructs a Zenodo access link used for editing the metadata of a Dockstore DOI.
   * @param doiUrl
   * @param accessLinkToken
   * @returns {string} Zenodo access link
   */
  transform(doiUrl: string, accessLinkToken: string): string {
    const zenodoUrl = Dockstore.ZENODO_AUTH_URL ? Dockstore.ZENODO_AUTH_URL.replace('oauth/authorize', '') : '';
    const doiUrlComponents = doiUrl.split('/');
    const doiSuffixComponents = doiUrlComponents[doiUrlComponents.length - 1].split('.');
    const recordId = doiSuffixComponents[doiSuffixComponents.length - 1];
    return zenodoUrl + 'records/' + recordId + '?token=' + accessLinkToken;
  }
}

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';

@Injectable({
  providedIn: 'root'
})
export class LaunchThirdPartyService {

  constructor() { }

  public dnanexusUrl(path: string, version: string): string {
      return Dockstore.DNANEXUS_IMPORT_URL + '?source=' + this.getTrsUrl(path, version);
  }

  public dnastackUrl(path: string, descriptorType: string): string {
    const httpParams = new HttpParams()
      .set('path', path)
      .set('descriptorType', descriptorType);
    return Dockstore.DNASTACK_IMPORT_URL + '?' + httpParams.toString();
  }

  public firecloudUrl(path: string, version: string): string {
    return `${Dockstore.FIRECLOUD_IMPORT_URL}/${path}:${version}`;
  }

  private getTrsUrl(path: string, versionName: string): string {
    return `${Dockstore.API_URI}${ga4ghPath}/tools/`
      + encodeURIComponent(`${ga4ghWorkflowIdPrefix + path}`)
      + '/versions/'
      + encodeURIComponent(`${versionName}`);
  }
}

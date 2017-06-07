import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Dockstore } from '../../shared/dockstore.model';
import { HttpService } from '../../shared/http.service';

@Injectable()
export class DescriptorsService {
  type: string;

  private descriptorToType = new Map([
    ['cwl', 'DOCKSTORE_CWL'],
    ['wdl', 'DOCKSTORE_WDL']
  ]);

  constructor(private httpService: HttpService) { }

  getFiles(id: number, versionName: string, descriptor: string, type: string) {
    let observable;
    this.type = type;
    if (descriptor === 'cwl') {
      observable = this.getCwlFiles(id, versionName);
    } else if (descriptor === 'wdl') {
      observable = this.getWdlFiles(id, versionName);
    }

    return observable.map(filesArray => {
      const files = [];
      files.push(filesArray[0]);
      for (const file of filesArray[1]) {
        files.push(file);
      }

      return files;
    });
  }

  private getCwlFiles(id: number, versionName: string) {
    return Observable.zip(
      this.getCwl(id, versionName),
      this.getSecondaryCwl(id, versionName)
    );
  }

  private getWdlFiles(id: number, versionName: string) {
    return Observable.zip(
      this.getWdl(id, versionName),
      this.getSecondaryWdl(id, versionName)
    );
  }

  private getCwl(id: number, versionName: string) {
    const cwlURL = `${ Dockstore.API_URI }/${ this.type }/${ id }/cwl?tag=${ versionName }`;
    return this.httpService.getResponse(cwlURL);
  }

  private getSecondaryCwl(id: number, versionName: string) {
    const sec_cwlURL = `${ Dockstore.API_URI }/${ this.type }/${ id }/secondaryCwl?tag=${ versionName }`;
    return this.httpService.getResponse(sec_cwlURL);
  }

  private getWdl(id: number, versionName: string) {
    const wdlURL = `${ Dockstore.API_URI }/${ this.type }/${ id }/wdl?tag=${ versionName }`;
    return this.httpService.getResponse(wdlURL);
  }

  private getSecondaryWdl(id: number, versionName: string) {
    const sec_wdlURL = `${ Dockstore.API_URI }/${ this.type }/${ id }/secondaryWdl?tag=${ versionName }`;
    return this.httpService.getResponse(sec_wdlURL);
  }
}

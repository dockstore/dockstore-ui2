import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Dockstore } from '../../shared/dockstore.model';
import { HttpService } from '../../shared/http.service';

@Injectable()
export class DescriptorsService {

  private descriptorToType = new Map([
    ['cwl', 'DOCKSTORE_CWL'],
    ['wdl', 'DOCKSTORE_WDL']
  ]);

  constructor(private httpService: HttpService) { }

  getFiles(id: number, versionName: string, descriptor: string) {
    let observable;

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
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/${ id }/cwl?tag=${ versionName }`);
  }

  private getSecondaryCwl(id: number, versionName: string) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/${ id }/secondaryCwl?tag=${ versionName }`);
  }

  private getWdl(id: number, versionName: string) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/${ id }/wdl?tag=${ versionName }`);
  }

  private getSecondaryWdl(id: number, versionName: string) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/${ id }/secondaryWdl?tag=${ versionName }`);
  }

}

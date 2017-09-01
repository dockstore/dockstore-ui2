import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { ContainersService } from '../../shared/swagger';
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

  constructor(private containersService: ContainersService, private workflowsService: WorkflowsService) { }

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
    if (this.type === 'workflows') {
      return this.workflowsService.cwl(id, versionName);
    } else {
      return this.containersService.cwl(id, versionName);
    }
  }

  private getSecondaryCwl(id: number, versionName: string) {
    if (this.type === 'workflows') {
      return this.workflowsService.secondaryCwl(id, versionName);
    } else {
      return this.containersService.secondaryCwl(id, versionName);
    }
  }

  private getWdl(id: number, versionName: string) {
    if (this.type === 'workflows') {
      return this.workflowsService.wdl(id, versionName);
    } else {
      return this.containersService.wdl(id, versionName);
    }
  }

  private getSecondaryWdl(id: number, versionName: string) {
    if (this.type === 'workflows') {
      return this.workflowsService.secondaryWdl(id, versionName);
    } else {
      return this.containersService.secondaryWdl(id, versionName);
    }
  }
}

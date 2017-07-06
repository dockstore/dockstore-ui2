import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';
import { HttpService } from './http.service';
@Injectable()
export class WorkflowService {
  private workflowSource = new BehaviorSubject<any>(null);
  // Observable streams
  workflow$ = this.workflowSource.asObservable(); // This is the selected workflow
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  constructor(private httpService: HttpService) {}
  setWorkflow(workflow: any) {
    this.workflowSource.next(workflow);
  }

  setWorkflows(workflows: any) {
    this.workflows$.next(workflows);
  }

  setNsWorkflows(nsWorkflows: any) {
    this.nsWorkflows$.next(nsWorkflows);
  }

  getParamsString(path: string, tagName: string) {
    return 'dockstore workflow convert entry2json --entry ' + path + ':' + tagName + ` > Dockstore.json
            \nvim Dockstore.json`;
  }

  getCliString(path: string, tagName: string) {
    return 'dockstore workflow launch --entry ' + path + ':' + tagName + ' --json Dockstore.json';
  }

  getCwlString(path: string, tagName: string) {
    return 'cwltool --non-strict https://www.dockstore.org:8443/api/ga4gh/v1/workflows/'
           + encodeURIComponent(path)
           + '/versions/'
           + tagName
           + '/plain-CWL/descriptor Dockstore.json';
  }
  getTestJson(workflowId: string, versionName: string) {
    const workflowTestUrl = Dockstore.API_URI + '/workflows/' + workflowId + '/testParameterFiles?version=' + versionName;
    return this.httpService.getResponse(workflowTestUrl);
  }

  getDescriptors(versions, version) {
    if (versions.length && version) {

      const typesAvailable = new Array();

      for (const file of version.sourceFiles) {
        const type = file.type;
        if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
          typesAvailable.push('cwl');

        } else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
          typesAvailable.push('wdl');
        }
      }
      return typesAvailable;
    }
  }
}

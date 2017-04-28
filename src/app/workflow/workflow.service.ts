import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class WorkflowService {
  constructor(private dockstoreService: DockstoreService) {}

  getPublishedWorkflowByPath(path: string) {
    const publishedWorkflowUrl = Dockstore.API_URI + '/workflows/path/workflow/' + path + '/published';
    return this.dockstoreService.getResponse(publishedWorkflowUrl);
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
}

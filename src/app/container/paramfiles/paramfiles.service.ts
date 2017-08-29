import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { Http, URLSearchParams, RequestMethod } from '@angular/http';
import { AuthService } from 'ng2-ui-auth';
import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';

import { HttpService } from '../../shared/http.service';

@Injectable()
export class ParamfilesService {
  type: string;
  // TODO: have an endpoints to
  // - get versions with test paramfiles
  // - get descriptors with test paramfiles for each version

  constructor(private httpService: HttpService, private authService: AuthService, public http: Http,
    private containersService: ContainersService, private workflowsService: WorkflowsService) { }

  getFiles(id: number, type: string, versionName?: string, descriptor?: string) {
    if (type === 'workflows') {
      return this.workflowsService.getTestParameterFiles(id, versionName);
    } else {
      return this.containersService.getTestParameterFiles(id, versionName, descriptor);
    }
  }

  // get descriptors which have test parameter files
  getDescriptors(version) {
    const descriptorsWithParamfiles = [];
    if (version) {
      for (const file of version.sourceFiles) {
        const type = file.type;
        if (type === 'CWL_TEST_JSON' && !descriptorsWithParamfiles.includes('cwl')) {
          descriptorsWithParamfiles.push('cwl');

        } else if (type === 'WDL_TEST_JSON' && !descriptorsWithParamfiles.includes('wdl')) {
          descriptorsWithParamfiles.push('wdl');
        }
      }
    }
    return descriptorsWithParamfiles;
  }

  // get versions which have test parameter files
  getVersions(versions) {
    const versionsWithParamfiles = [];
    if (versions) {
      for (const version of versions) {
        if (this.getDescriptors(version).length) {
          versionsWithParamfiles.push(version);
        }
      }
    }
    return versionsWithParamfiles;
  }

}

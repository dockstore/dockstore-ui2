import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';

import { HttpService } from '../../shared/http.service';

@Injectable()
export class ParamfilesService {
  type: string;
  // TODO: have an endpoints to
  // - get versions with test paramfiles
  // - get descriptors with test paramfiles for each version

  constructor(private httpService: HttpService) { }

  getFiles(id: number, type: string, versionName?: string, descriptor?: string) {
    let testParamFilesUrl = Dockstore.API_URI + '/' + type + '/' + id + '/testParameterFiles';
    if (type === 'containers') {
      if (versionName && descriptor) {
        testParamFilesUrl += '?tag=' + versionName;
        testParamFilesUrl += '&descriptorType=' + descriptor;
      } else if (versionName) {
        testParamFilesUrl += '?tag=' + versionName;
      } else if (testParamFilesUrl) {
        testParamFilesUrl += '?descriptor=' + descriptor;
      }
    } else if (type === 'workflows') {
      if (versionName) {
        testParamFilesUrl += '?version=' + versionName;
      }
    }
    return this.httpService.getResponse(testParamFilesUrl);
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

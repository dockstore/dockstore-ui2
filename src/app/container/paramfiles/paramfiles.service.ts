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

  constructor(private httpService: HttpService, private authService: AuthService, public http: Http) { }

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

  putFiles(containerId: number, testParameterFiles: Array<string>, tagName: string, descriptorType: string) {
    return this.requestFiles(containerId, testParameterFiles, tagName, descriptorType, RequestMethod.Put);
  }

  deleteFiles(containerId: number, testParameterFiles: Array<string>, tagName: string, descriptorType: string) {
    return this.requestFiles(containerId, testParameterFiles, tagName, descriptorType, RequestMethod.Delete);
  }

  private requestFiles(containerId: number, testParameterFiles: Array<string>,
    tagName: string, descriptorType: string, method: RequestMethod) {
    const url = `${Dockstore.API_URI}/containers/${containerId}/testParameterFiles`;
    const myParams = new URLSearchParams();
    testParameterFiles.forEach((file) => {
      myParams.append('testParameterPaths', file);
    });
    myParams.set('tagName', tagName);
    myParams.set('descriptorType', descriptorType);
    return this.httpService.request(url, myParams, method, this.authService.getToken());
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

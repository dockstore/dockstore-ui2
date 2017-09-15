import { LaunchService } from '../../shared/launch.service';
import { Dockstore } from '../../shared/dockstore.model';
export class WorkflowLaunchService extends LaunchService {
  getParamsString(path: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = WorkflowLaunchService.descriptorWdl;
    }
    return '$ dockstore workflow convert entry2json --entry' + descriptor + ` ${ path }:${ versionName } > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(path: string, versionName: string, currentDescriptor: string) {
    return `$ dockstore workflow launch --entry ${ path }:${ versionName } --json Dockstore.json`;
  }

  getCwlString(path: string, versionName: string) {
    return `$ cwltool --non-strict ${ Dockstore.API_URI }/api/ga4gh/v1/tools/${ encodeURIComponent('#workflow/' + path) }` +
      `/versions/${ encodeURIComponent(versionName) }/plain-CWL/descriptor Dockstore.json`;
  }
}

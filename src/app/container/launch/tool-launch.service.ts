import { LaunchService } from './../../shared/launch.service';
import { Dockstore } from '../../shared/dockstore.model';
export class ToolLaunchService extends LaunchService {
  getParamsString(path: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = ToolLaunchService.descriptorWdl;
    }

    return '$ dockstore tool convert entry2json' + descriptor + ` --entry ${path}:${versionName} > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(path: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = ToolLaunchService.descriptorWdl;
    }

    return `$ dockstore tool launch --entry ${path}:${versionName} --json Dockstore.json` + descriptor;
  }

  getCwlString(path: string, versionName: string) {
    return '$ cwltool --non-strict ' +
      `${Dockstore.API_URI}/api/ga4gh/v1/tools/${encodeURIComponent(path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-CWL/descriptor Dockstore.json`;
  }
}

import { Dockstore } from '../../shared/dockstore.model';
export class LaunchService {

  private static readonly descriptorWdl = ' --descriptor wdl';

  getParamsString(workflowPath: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = LaunchService.descriptorWdl;
    }
    return '$ dockstore workflow convert entry2json --entry' + descriptor + ` ${ workflowPath }:${ versionName } > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(workflowPath: string, versionName: string, currentDescriptor: string) {
    return `$ dockstore workflow launch --entry ${ workflowPath }:${ versionName } --json Dockstore.json`;
  }

  getCwlString(workflowPath: string, versionName: string) {
    return `$ cwltool --non-strict ${ Dockstore.API_URI }/api/ga4gh/v1/tools/${ encodeURIComponent('#workflow/' + workflowPath) }` +
      `/versions/${ encodeURIComponent(versionName) }/plain-CWL/descriptor Dockstore.json`;
  }

  getConsonanceString(workflowPath: string, versionName: string) {
    return `$ consonance run --tool-dockstore-id ${ workflowPath }:${ versionName } ` +
      '--run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
  }
}

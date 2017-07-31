import { Dockstore } from '../../shared/dockstore.model';
export class LaunchService {

  private static readonly descriptorWdl = ' --descriptor wdl';

  getParamsString(toolPath: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = LaunchService.descriptorWdl;
    }

    return '$ dockstore tool convert entry2json' + descriptor + ` --entry ${ toolPath }:${ versionName } > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(toolPath: string, versionName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = LaunchService.descriptorWdl;
    }

    return `$ dockstore tool launch --entry ${ toolPath }:${ versionName } --json Dockstore.json` + descriptor;
  }

  getCwlString(toolPath: string, versionName: string, toolName: string) {
    let encodeToolName = '';
    if (toolName) {
      encodeToolName = `${ encodeURIComponent('/' + toolName) }`;
    }
    return '$ cwltool --non-strict ' +
            `${ Dockstore.API_URI }/api/ga4gh/v1/tools/${ encodeURIComponent(toolPath) }${encodeToolName}` +
            `/versions/${ encodeURIComponent(versionName) }/plain-CWL/descriptor Dockstore.json`;
  }

  getConsonanceString(toolPath: string, versionName: string) {
    return `$ consonance run --tool-dockstore-id ${ toolPath }:${ versionName } ` +
           '--run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
  }

}

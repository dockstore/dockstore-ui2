import { Pipe, PipeTransform } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Dockstore } from '../dockstore.model';
@Pipe({
  name: 'toolTesterLog',
})
export class ToolTesterLogPipe implements PipeTransform {
  constructor(private router: Router) {}

  /**
   * This creates the ToolTester log URL
   *
   * @param {string} toolId  The TRS Tool Id
   * @param {string} toolVersionName  The TRS ToolVersion's name
   * @param {string} testFileName  The test file name
   * @param {string} runner  The runner (cwltool, cromwell)
   * @param {string} filename  The name of the log file
   * @returns {string}
   * @memberof ToolTesterLogPipe
   */
  transform(toolId: string, toolVersionName: string, testFileName: string, runner: string, filename: string): string {
    const urlTree: UrlTree = this.router.createUrlTree(['toolTester', 'logs'], {
      queryParams: {
        tool_id: toolId,
        tool_version_name: toolVersionName,
        test_filename: testFileName,
        runner: runner,
        log_type: 'FULL',
        filename: filename,
      },
    });
    return Dockstore.API_URI + urlTree.toString();
  }
}

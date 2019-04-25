import { Pipe, PipeTransform } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Dockstore } from '../dockstore.model';
@Pipe({
  name: 'toolTesterLog'
})
export class ToolTesterLogPipe implements PipeTransform {

  constructor(private router: Router) {

  }

  transform(toolId: string, toolVersionName: string, testFileName: string, runner: string, filename: string): any {
    console.log(toolId);
    const urlTree: UrlTree = this.router.createUrlTree(['toolTester', 'logs'], {
      queryParams: {
        tool_id: toolId,
        tool_version_name: toolVersionName,
        test_filename: testFileName,
        runner: runner,
        log_type: 'FULL',
        filename: filename
      },
    });
    return Dockstore.API_URI + urlTree.toString();
  }

}

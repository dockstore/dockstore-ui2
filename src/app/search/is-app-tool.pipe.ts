import { Pipe, PipeTransform } from '@angular/core';
import { AppTool, DockstoreTool } from '../shared/swagger';

@Pipe({
  name: 'isAppTool',
})
export class IsAppToolPipe implements PipeTransform {
  transform(tool: DockstoreTool | AppTool): tool is AppTool {
    return (tool as AppTool).full_workflow_path !== undefined;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { AppTool, DockstoreTool } from '../shared/openapi';

@Pipe({
  name: 'isAppTool',
  standalone: true,
})
export class IsAppToolPipe implements PipeTransform {
  transform(tool: DockstoreTool | AppTool): tool is AppTool {
    if (tool !== null) {
      return (tool as AppTool).full_workflow_path !== undefined;
    }
  }
}

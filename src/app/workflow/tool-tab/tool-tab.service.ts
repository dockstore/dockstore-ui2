import { Injectable } from '@angular/core';
import { ToolDescriptor } from '../../shared/swagger';

@Injectable({
  providedIn: 'root'
})
export class ToolTabService {
  constructor() {}

  /**
   * Determines the second column's header name. No break needed because headings are always short.
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  The current workflow's descriptor type
   * @returns {string}                                The heading
   * @memberof ToolTabService
   */
  descriptorTypeToHeaderName(descriptorType: ToolDescriptor.TypeEnum): string {
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL:
        return 'Tool Excerpt';
      case ToolDescriptor.TypeEnum.WDL:
        return 'Task Excerpt';
      case ToolDescriptor.TypeEnum.NFL:
        return 'Process Excerpt';
      case ToolDescriptor.TypeEnum.SERVICE:
        return 'Service';
      case ToolDescriptor.TypeEnum.GXFORMAT2:
        return 'Tool Excerpt';
      default:
        console.log('Unknown descriptor type found: ' + descriptorType);
        return 'Tool Excerpt';
    }
  }

  /**
   * In the Workflow Excerpt column, each row will have a heading before the tool.id.
   * This determines that heading.
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  The current workflow's descriptor type
   * @returns {string}                                The heading
   * @memberof ToolTabService
   */
  descriptorTypeToWorkflowExcerptRowHeading(descriptorType: ToolDescriptor.TypeEnum): string {
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL:
        return 'tool\xa0ID';
      case ToolDescriptor.TypeEnum.WDL:
        return 'task\xa0ID';
      case ToolDescriptor.TypeEnum.NFL:
        return 'process\xa0name';
      case ToolDescriptor.TypeEnum.GXFORMAT2:
        return 'tool\xa0ID';
      default:
        console.log('Unknown descriptor type found: ' + descriptorType);
        return 'tool\xa0ID';
    }
  }
}

import { Injectable } from '@angular/core';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
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
    return DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).toolTab.workflowStepHeader;
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
    return DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).toolTab.rowIdentifier;
  }
}

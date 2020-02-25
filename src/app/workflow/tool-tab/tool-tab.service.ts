import { Injectable } from '@angular/core';
import { superDescriptorLanguages, superUnknown } from 'app/entry/superDescriptorLanguage';
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
    const foundSuperDescriptorLanguage = superDescriptorLanguages.find(
      superDescriptorLanguage => superDescriptorLanguage.toolDescriptorEnum === descriptorType
    );
    if (foundSuperDescriptorLanguage) {
      return foundSuperDescriptorLanguage.toolTab.secondColumnHeading;
    }
    return superUnknown.toolTab.secondColumnHeading;
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
    const foundSuperDescriptorLanguage = superDescriptorLanguages.find(
      superDescriptorLanguage => superDescriptorLanguage.toolDescriptorEnum === descriptorType
    );
    if (foundSuperDescriptorLanguage) {
      return foundSuperDescriptorLanguage.toolTab.rowIdentifier;
    }
    return superUnknown.toolTab.rowIdentifier;
  }
}

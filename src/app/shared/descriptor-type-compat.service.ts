/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Injectable } from '@angular/core';
import { extendedDescriptorLanguages, extendedUnknownDescriptor } from 'app/entry/extendedDescriptorLanguage';
import { ToolDescriptor, Workflow } from './swagger';

/**
 * This service is for maintaining compatibility until descriptor types are standardized across all of Dockstore
 *
 * @export
 * @class DescriptorTypeCompatService
 */
@Injectable({
  providedIn: 'root',
})
export class DescriptorTypeCompatService {
  constructor() {}

  /**
   * Checks if the descriptor type string is valid
   *
   * @private
   * @param {string} descriptor
   * @memberof LaunchComponent
   */
  public stringToDescriptorType(descriptorType: string | Workflow.DescriptorTypeEnum): ToolDescriptor.TypeEnum | null {
    const foundextendedDescriptorLanguageFromValue = extendedDescriptorLanguages.find(
      (extendedDescriptorLanguage) => extendedDescriptorLanguage.toolDescriptorEnum === descriptorType
    );
    if (foundextendedDescriptorLanguageFromValue) {
      return foundextendedDescriptorLanguageFromValue.toolDescriptorEnum;
    }
    const foundExtendedDescriptorLanguageFromWorkflowDescriptorType = extendedDescriptorLanguages.find(
      (extendedDescriptorLanguage) => extendedDescriptorLanguage.workflowDescriptorEnum === descriptorType
    );
    if (foundExtendedDescriptorLanguageFromWorkflowDescriptorType) {
      return foundExtendedDescriptorLanguageFromWorkflowDescriptorType.toolDescriptorEnum;
    }
    return extendedUnknownDescriptor.toolDescriptorEnum;
  }

  /**
   * Converts the ToolDescriptor.TypeEnum to the plain text type
   *
   * @param {ToolDescriptor.TypeEnum} typeEnum  The ToolDescriptor.TypeEnum to convert
   * @returns {string}  Plain type that the TRS accepts
   * @memberof DescriptorTypeCompatService
   */
  public toolDescriptorTypeEnumToPlainTRS(typeEnum: ToolDescriptor.TypeEnum): string | null {
    const foundExtendedDescriptorLanguage = extendedDescriptorLanguages.find(
      (extendedDescriptorLanguage) => extendedDescriptorLanguage.toolDescriptorEnum === typeEnum
    );
    if (foundExtendedDescriptorLanguage) {
      return foundExtendedDescriptorLanguage.plainTRS;
    }
    return extendedUnknownDescriptor.plainTRS;
  }
}

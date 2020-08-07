/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';

import { extendedDescriptorLanguages } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor } from './swagger';

@Injectable({ providedIn: 'root' })
export class DescriptorService {
  constructor() {}

  /**
   * Gets the descriptor types (cwl/wdl/nfl) that the version has a sourcefile of
   *
   * @param {any} version the current selected version of the workflow or tool
   * @returns an array that may contain 'cwl' or 'wdl' or 'nfl'
   * @memberof DescriptorService
   */
  getDescriptors(version, versionsFileTypes: Array<SourceFile.TypeEnum>): Array<ToolDescriptor.TypeEnum> {
    const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
    if (versionsFileTypes) {
      versionsFileTypes.forEach((element: SourceFile.TypeEnum) => {
        extendedDescriptorLanguages.forEach(extendedDescriptorLanguage => {
          if (extendedDescriptorLanguage.descriptorFileTypes.includes(element)) {
            descriptorTypes.push(extendedDescriptorLanguage.toolDescriptorEnum);
          }
        });
      });
    }
    return descriptorTypes;
  }

  /**
   * Gets the descriptor types (CWL/WDL/NFL) that a version has a sourcefile for and that is valid
   * @param {any} version the current selected version of the workflow or tool
   * @returns an array that may contain 'CWL' or 'WDL' or 'NFL'
   * @memberof DescriptorService
   */
  getValidDescriptors(version): Array<ToolDescriptor.TypeEnum> {
    const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
    if (version && version.validations) {
      extendedDescriptorLanguages.forEach(extendedDescriptorLanguage => {
        const cwlValidation = version.validations.find(validation => {
          return extendedDescriptorLanguage.descriptorFileTypes.includes(validation.type);
        });
        if (cwlValidation && cwlValidation.valid) {
          descriptorTypes.push(extendedDescriptorLanguage.toolDescriptorEnum);
        }
      });
    }
    return descriptorTypes;
  }
}

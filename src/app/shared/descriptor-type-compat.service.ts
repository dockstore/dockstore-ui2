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
import { ToolDescriptor } from './swagger';

export enum WebserviceDescriptorTypeEnum {
  CWL = 'cwl',
  WDL = 'wdl',
  NFL = 'nfl'
}

/**
 * This service is for maintaining compatatibility until descriptor types are standardized across all of Dockstore
 *
 * @export
 * @class DescriptorTypeCompatService
 */
@Injectable({
  providedIn: 'root'
})
export class DescriptorTypeCompatService {

constructor() { }

  /**
   * Checks if the descriptor type string is valid
   *
   * @private
   * @param {string} descriptor
   * @memberof LaunchComponent
   */
  public stringToDescriptorType(descriptorType: string): ToolDescriptor.TypeEnum {
    switch (descriptorType) {
      case WebserviceDescriptorTypeEnum.CWL: {
        return ToolDescriptor.TypeEnum.CWL;
      }
      case ToolDescriptor.TypeEnum.CWL: {
        console.log('Unneeded conversion');
        return ToolDescriptor.TypeEnum.CWL;
      }
      case WebserviceDescriptorTypeEnum.WDL: {
        return ToolDescriptor.TypeEnum.WDL;
      }
      case ToolDescriptor.TypeEnum.WDL: {
        console.log('Unneeded conversion');
        return ToolDescriptor.TypeEnum.WDL;
      }
      case WebserviceDescriptorTypeEnum.NFL: {
        return ToolDescriptor.TypeEnum.NFL;
      }
      case ToolDescriptor.TypeEnum.NFL: {
        console.log('Unneeded conversion');
        return ToolDescriptor.TypeEnum.NFL;
      }
      default: {
        console.error('Unrecognized descriptor type: ' + descriptorType);
      }
    }
  }

}

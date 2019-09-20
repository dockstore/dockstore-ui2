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
import { ToolDescriptor, Workflow } from './swagger';
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

export enum WebserviceDescriptorTypeEnum {
  CWL = 'cwl',
  WDL = 'wdl',
  // DOCKSTORE-2428 - demo how to add new workflow language
  // SWL = 'swl',
  NFL = 'nfl',
  SERVICE = 'service'
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
  constructor() {}

  /**
   * Checks if the descriptor type string is valid
   *
   * @private
   * @param {string} descriptor
   * @memberof LaunchComponent
   */
  public stringToDescriptorType(descriptorType: string): ToolDescriptor.TypeEnum {
    if (descriptorType.toUpperCase() === DescriptorTypeEnum.CWL) {
      return ToolDescriptor.TypeEnum.CWL;
    } else if (descriptorType.toUpperCase() === DescriptorTypeEnum.WDL) {
      return ToolDescriptor.TypeEnum.WDL;
    } else if (descriptorType.toUpperCase() === DescriptorTypeEnum.NFL) {
      return ToolDescriptor.TypeEnum.NFL;
    } else if (descriptorType.toUpperCase() === DescriptorTypeEnum.Service) {
      return ToolDescriptor.TypeEnum.SERVICE;
    }

    // the following probably needs cleanup, not sure if it covers any cases the above doesn't
    switch (descriptorType) {
      case DescriptorTypeEnum.CWL: {
        return ToolDescriptor.TypeEnum.CWL;
      }
      case ToolDescriptor.TypeEnum.CWL: {
        console.log('Unneeded conversion');
        return ToolDescriptor.TypeEnum.CWL;
      }
      case DescriptorTypeEnum.WDL: {
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
      case WebserviceDescriptorTypeEnum.SERVICE: {
        return ToolDescriptor.TypeEnum.SERVICE;
      }

      // DOCKSTORE-2428 - demo how to add new workflow language
      // case WebserviceDescriptorTypeEnum.SWL: {
      //   return ToolDescriptor.TypeEnum.SWL;
      // }
      // case ToolDescriptor.TypeEnum.SWL: {
      //   console.log('Unneeded conversion');
      //   return ToolDescriptor.TypeEnum.SWL;
      // }

      default: {
        console.error('Unrecognized descriptor type: ' + descriptorType);
      }
    }
  }

  /**
   * Converts the ToolDescriptor.TypeEnum to the plain text type
   *
   * @param {ToolDescriptor.TypeEnum} typeEnum  The ToolDescriptor.TypeEnum to convert
   * @returns {string}  Plain type that the TRS accepts
   * @memberof DescriptorTypeCompatService
   */
  public toolDescriptorTypeEnumToPlainTRS(typeEnum: ToolDescriptor.TypeEnum): string {
    switch (typeEnum) {
      case ToolDescriptor.TypeEnum.WDL:
        return 'PLAIN-WDL';
      case ToolDescriptor.TypeEnum.CWL:
        return 'PLAIN-CWL';
      case ToolDescriptor.TypeEnum.NFL:
        return 'PLAIN-NFL';
      case ToolDescriptor.TypeEnum.SERVICE:
        return 'PLAIN-SERVICE';
      default:
        console.error('Unhandled descriptor type: ' + typeEnum);
        return null;
    }
  }
}

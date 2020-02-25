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
  getDescriptors(version): Array<ToolDescriptor.TypeEnum> {
    if (version) {
      const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
      const unique = new Set(version.sourceFiles.map((sourceFile: SourceFile) => sourceFile.type));
      unique.forEach(element => {
        if (element === SourceFile.TypeEnum.DOCKSTORECWL) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.CWL);
        } else if (element === SourceFile.TypeEnum.DOCKSTOREWDL) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.WDL);
        } else if (element === SourceFile.TypeEnum.NEXTFLOW || element === SourceFile.TypeEnum.NEXTFLOWCONFIG) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.NFL);
        } else if (element === SourceFile.TypeEnum.DOCKSTOREGXFORMAT2) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.GXFORMAT2);
        }
        // DOCKSTORE-2428 - demo how to add new workflow language
        // else if (element === SourceFile.TypeEnum.DOCKSTORESWL) {
        //   descriptorTypes.push(ToolDescriptor.TypeEnum.SWL);
        // }
      });
      return descriptorTypes;
    }
  }

  /**
   * Gets the descriptor types (CWL/WDL/NFL) that a version has a sourcefile for and that is valid
   * @param {any} version the current selected version of the workflow or tool
   * @returns an array that may contain 'CWL' or 'WDL' or 'NFL'
   * @memberof DescriptorService
   */
  getValidDescriptors(version) {
    if (version) {
      const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
      if (version.validations) {
        const cwlValidation = version.validations.find(validation => {
          return validation.type === SourceFile.TypeEnum.DOCKSTORECWL;
        });
        if (cwlValidation && cwlValidation.valid) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.CWL);
        }

        const wdlValidation = version.validations.find(validation => {
          return validation.type === SourceFile.TypeEnum.DOCKSTOREWDL;
        });
        if (wdlValidation && wdlValidation.valid) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.WDL);
        }

        const nflValidation = version.validations.find(validation => {
          return validation.type === SourceFile.TypeEnum.NEXTFLOW || validation.type === SourceFile.TypeEnum.NEXTFLOWCONFIG;
        });
        if (nflValidation && nflValidation.valid) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.NFL);
        }

        const galaxyValidation = version.validations.find(validation => {
          return validation.type === SourceFile.TypeEnum.DOCKSTOREGXFORMAT2;
        });
        if (galaxyValidation && galaxyValidation.valid) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.GXFORMAT2);
        }

        // DOCKSTORE-2428 - demo how to add new workflow language
        // const swlValidation = version.validations.find((validation) => {
        //   return validation.type === SourceFile.TypeEnum.DOCKSTORESWL ||
        //     validation.type === SourceFile.TypeEnum.DOCKSTORESWL;
        // });
        // if (swlValidation && swlValidation.valid) {
        //   descriptorTypes.push(ToolDescriptor.TypeEnum.SWL);
        // }
      }
      return descriptorTypes;
    }
  }
}

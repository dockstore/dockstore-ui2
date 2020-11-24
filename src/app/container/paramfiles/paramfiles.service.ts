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

import { SourceFile, ToolDescriptor, Validation } from '../../shared/swagger';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Tag } from './../../shared/swagger/model/tag';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Injectable()
export class ParamfilesService {
  type: string;
  // TODO: have an endpoints to
  // - get versions with test paramfiles
  // - get descriptors with test paramfiles for each version

  constructor(private containersService: ContainersService, private workflowsService: WorkflowsService) {}

  getFiles(id: number, type: string, versionName?: string, descriptor?: ToolDescriptor.TypeEnum) {
    if (type === 'workflows') {
      return this.workflowsService.getTestParameterFiles(id, versionName);
    } else {
      if (descriptor === 'CWL' || descriptor === 'WDL') {
        return this.containersService.getTestParameterFiles(id, descriptor, versionName);
      }
    }
  }

  // get descriptors which have test parameter files
  getDescriptors(versionsFileTypes: Array<SourceFile.TypeEnum>): Array<ToolDescriptor.TypeEnum> {
    const descriptorsWithParamfiles: Array<ToolDescriptor.TypeEnum> = [];
    if (versionsFileTypes) {
      for (const type of versionsFileTypes) {
        if (type === SourceFile.TypeEnum.CWLTESTJSON && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.CWL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.CWL);
        } else if (type === SourceFile.TypeEnum.WDLTESTJSON && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.WDL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.WDL);
        } else if (type === SourceFile.TypeEnum.NEXTFLOWTESTPARAMS && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.NFL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.NFL);
        } else if (
          type === SourceFile.TypeEnum.GXFORMAT2TESTFILE &&
          !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.GXFORMAT2)
        ) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.GXFORMAT2);
        }
        // DOCKSTORE-2428 - demo how to add new workflow language
        // else if (type === 'SWL_TEST_JSON' && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.SWL)) {
        //   descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.SWL);
        // }
      }
    }
    return descriptorsWithParamfiles;
  }

  /**
   * Gets the descriptor types (CWL/WDL/NFL) that are valid and have valid test parameter files
   * @param version the current selected version of the workflow or tool
   * @returns an array that may contain 'CWL' or 'WDL' or 'NFL'
   */
  getValidDescriptors(version: WorkflowVersion | Tag, versionsFileTypes: Array<SourceFile.TypeEnum>) {
    if (version) {
      const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
      if (version.validations && versionsFileTypes) {
        if (this.checkValidFileType(version, SourceFile.TypeEnum.CWLTESTJSON, SourceFile.TypeEnum.DOCKSTORECWL, versionsFileTypes)) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.CWL);
        }

        if (this.checkValidFileType(version, SourceFile.TypeEnum.WDLTESTJSON, SourceFile.TypeEnum.DOCKSTOREWDL, versionsFileTypes)) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.WDL);
        }

        if (
          this.checkValidFileType(version, SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, SourceFile.TypeEnum.NEXTFLOWCONFIG, versionsFileTypes)
        ) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.NFL);
        }

        if (
          this.checkValidFileType(version, SourceFile.TypeEnum.GXFORMAT2TESTFILE, SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, versionsFileTypes)
        ) {
          descriptorTypes.push(ToolDescriptor.TypeEnum.GXFORMAT2);
        }
        // DOCKSTORE-2428 - demo how to add new workflow language
        // if (this.checkValidFileType(version, SourceFile.TypeEnum.SWLTESTJSON, SourceFile.TypeEnum.DOCKSTORESWL)) {
        //   descriptorTypes.push(ToolDescriptor.TypeEnum.SWL);
        // }
      }
      return descriptorTypes;
    }
  }

  /**
   * A helper method that checks for a given version and file type,
   * if the file type has a valid validation and at least one file is present.
   * The related language must have a valid descriptor too.
   * All these must be true to show the corresponding language in the dropdown
   * @param version Version of interest
   * @param fileType Ex. SourceFile.TypeEnum.CWLTESTJSON
   * @param descriptorType Ex. SourceFile.TypeEnum.DOCKSTORECWL
   */
  checkValidFileType(
    version: WorkflowVersion | Tag,
    fileType: SourceFile.TypeEnum,
    descriptorType: SourceFile.TypeEnum,
    versionsFileTypes: Array<SourceFile.TypeEnum>
  ) {
    // Check that the language has a valid descriptor
    const descriptorValidation = version.validations.find((validation: Validation) => {
      return validation.type === descriptorType;
    });

    if (!(descriptorValidation && descriptorValidation.valid)) {
      return false;
    }

    // Check that at least one file is valid
    const validationObject = version.validations.find((validation: Validation) => {
      return validation.type === fileType;
    });

    if (!(validationObject && validationObject.valid)) {
      return false;
    }

    // Check that at least one file is present
    const languageFile = versionsFileTypes.find((type) => {
      return type === fileType;
    });

    return languageFile !== undefined;
  }
}

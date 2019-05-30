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

import { ToolDescriptor, SourceFile, Validation } from '../../shared/swagger';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Tag } from './../../shared/swagger/model/tag';

@Injectable()
export class ParamfilesService {
  type: string;
  // TODO: have an endpoints to
  // - get versions with test paramfiles
  // - get descriptors with test paramfiles for each version

  constructor(private containersService: ContainersService, private workflowsService: WorkflowsService) { }

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
  getDescriptors(version: (WorkflowVersion|Tag)): Array<ToolDescriptor.TypeEnum> {
    const descriptorsWithParamfiles: Array<ToolDescriptor.TypeEnum> = [];
    if (version) {
      for (const file of version.sourceFiles) {
        const type = file.type;
        if (type === 'CWL_TEST_JSON' && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.CWL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.CWL);
        } else if (type === 'WDL_TEST_JSON' && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.WDL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.WDL);
        } else if (type === 'NEXTFLOW_TEST_PARAMS' && !descriptorsWithParamfiles.includes(ToolDescriptor.TypeEnum.NFL)) {
          descriptorsWithParamfiles.push(ToolDescriptor.TypeEnum.NFL);
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
    getValidDescriptors(version: (WorkflowVersion|Tag)) {
      if (version) {
        const descriptorTypes: Array<ToolDescriptor.TypeEnum> = [];
        if (version.validations) {
          if (this.checkValidFileType(version, SourceFile.TypeEnum.CWLTESTJSON, SourceFile.TypeEnum.DOCKSTORECWL)) {
            descriptorTypes.push(ToolDescriptor.TypeEnum.CWL);
          }

          if (this.checkValidFileType(version, SourceFile.TypeEnum.WDLTESTJSON, SourceFile.TypeEnum.DOCKSTOREWDL)) {
            descriptorTypes.push(ToolDescriptor.TypeEnum.WDL);
          }

          if (this.checkValidFileType(version, SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, SourceFile.TypeEnum.NEXTFLOWCONFIG)) {
            descriptorTypes.push(ToolDescriptor.TypeEnum.NFL);
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
    checkValidFileType(version: (WorkflowVersion|Tag), fileType: SourceFile.TypeEnum, descriptorType: SourceFile.TypeEnum) {
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
      const languageFile = version.sourceFiles.find((sourceFile) => {
        return sourceFile.type === fileType;
      });

      return languageFile !== undefined;
    }

  // get versions which have test parameter files
  getVersions(versions: Array<Tag | WorkflowVersion>) {
    const versionsWithParamfiles = [];
    if (versions) {
      for (const version of versions) {
        if (this.getDescriptors(version).length) {
          versionsWithParamfiles.push(version);
        }
      }
    }
    return versionsWithParamfiles;
  }

}

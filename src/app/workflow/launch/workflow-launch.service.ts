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
import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { Dockstore } from '../../shared/dockstore.model';
import { LaunchService } from '../../shared/launch.service';
import { ToolDescriptor } from '../../shared/openapi';
import { EntryType } from '../../shared/enum/entry-type';
import { Workflow } from '../../shared/openapi/model/workflow';

@Injectable()
export class WorkflowLaunchService extends LaunchService {
  private type = 'workflow';
  private wesInputFile = 'Dockstore.json';
  private agcWrapperFile = 'agcWrapper.json';

  constructor(protected descriptorTypeCompatService: DescriptorTypeCompatService) {
    super(descriptorTypeCompatService);
  }
  getParamsString(path: string, versionName: string, currentDescriptor: ToolDescriptor.TypeEnum) {
    if (currentDescriptor === ToolDescriptor.TypeEnum.NFL) {
      return `vim Dockstore.json`;
    }
    return `dockstore ${this.type} convert entry2json --entry ${path}:${versionName} > Dockstore.json
            \nvim Dockstore.json`;
  }

  getDockstoreSupportedCwlLaunchString(path: string, versionName: string, entryType?: EntryType) {
    if (entryType === EntryType.Tool) {
      return super.getDockstoreSupportedCwlLaunchString(path, versionName);
    }
    return `cwltool \\#workflow/${path}:${versionName} Dockstore.json`;
  }

  getDockstoreSupportedCwlMakeTemplateString(path: string, versionName: string, entryType?: EntryType) {
    if (entryType === EntryType.Tool) {
      return super.getDockstoreSupportedCwlMakeTemplateString(path, versionName);
    }
    return `cwltool --make-template \\#workflow/${path}:${versionName} > input.yaml`;
  }

  getCliString(path: string, versionName: string, currentDescriptor: string) {
    return `dockstore ${this.type} launch --entry ${path}:${versionName} --json Dockstore.json`;
  }

  getCwlString(path: string, versionName: string, mainDescriptor: string) {
    const id = encodeURIComponent(ga4ghWorkflowIdPrefix + path);
    return (
      `cwl-runner ${Dockstore.API_URI}${ga4ghPath}/tools/${id}` +
      `/versions/${encodeURIComponent(versionName)}/PLAIN_CWL/descriptor/${mainDescriptor} Dockstore.json`
    );
  }

  getCheckWorkflowString(path: string, versionName: string): string {
    return this.getCheckEntry(path, versionName);
  }

  getWesLaunch(workflowPath: string, versionName: string) {
    return `dockstore workflow wes launch --entry ${workflowPath}:${versionName} --json ${this.agcWrapperFile} -a ${this.wesInputFile}`;
  }

  getAgcFileWrapper() {
    return `echo '{\"workflowInputs\": \"${this.wesInputFile}\"}' > ${this.agcWrapperFile}`;
  }

  getToilLaunchCommand(workflow: Workflow, versionName: string) {
    const language = String(workflow.descriptorType).toLowerCase();
    const inputFile = 'Dockstore.json';
    const inputArguments = language === 'wdl' ? `--input ${inputFile}` : inputFile;
    return `toil-${language}-runner '${workflow.trsId}:${versionName}' ${inputArguments}`;
  }

  getSnakemakeGetWorkflowCommand(workflow: Workflow, versionName: string): string {
    return [
      `git clone --branch ${versionName} https://github.com/${workflow.organization}/${workflow.repository}`,
      `cd ${workflow.repository}`,
    ].join('\n');
  }

  getSnakemakeRunWorkflowCommand(workflow: Workflow, versionName: string): string {
    return 'snakemake --cores 1';
  }
}

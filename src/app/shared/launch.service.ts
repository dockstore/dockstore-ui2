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

import { ga4ghPath } from './constants';
import { Dockstore } from './dockstore.model';
import { EntryType } from './enum/entryType.enum';

@Injectable()
export abstract class LaunchService {
    protected static readonly descriptorWdl = ' --descriptor wdl';
    public readonly cwlrunnerDescription =
    'Run locally with cwl-runner when all inputs and outputs are available on the local filesystem';
    public readonly nonStrict =
    'You can use \'--non-strict\' when the executor is cwltool for lenient validation (ignore unrecognized fields)';
    public readonly cwlrunnerTooltip = 'Commands for launching tools/workflows through cwl-runner. ' + this.nonStrict;
    public readonly cwltoolTooltip = 'Commands for launching tools/workflows through CWLtool: the CWL reference implementation. ' +
    this.nonStrict;
    constructor() { }
    abstract getParamsString(path: string, versionName: string, currentDescriptor: string);
    abstract getCliString(path: string, versionName: string, currentDescriptor: string);
    abstract getCwlString(path: string, versionName: string, mainDescriptor: string);

    getConsonanceString(path: string, versionName: string) {
        return `$ consonance run --tool-dockstore-id ${path}:${versionName} ` +
            '--run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
    }

    /**
     * This creates the Dockstore-supported cwltool launch command
     * @param path The GA4GH Tool's path
     * @param versionName The ToolVersion's name
     */
    getDockstoreSupportedCwlLaunchString(path: string, versionName: string) {
        return `$ cwltool ${path}:${versionName} Dockstore.json`;
    }

    /**
     * This creates the Dockstore-supported cwltool make-template command
     * @param path The GA4GH Tool's path
     * @param versionName The ToolVersion's name
     */
    getDockstoreSupportedCwlMakeTemplateString(path: string, versionName: string) {
        return `$ cwltool --make-template ${path}:${versionName} > input.yaml`;
    }

    /**
     * Gets the tool/workflow check command
     * @param path The tool/workflow's path
     * @param versionName The version name tool/workflow
     */
    getCheckEntry(path: string, versionName: string, entryType: EntryType) {
        if (path) {
            const entryName = path + (versionName ? ':' + versionName : '');
            return '$ dockstore checker launch --entry ' + entryName + ' --json checkparam.json';
        } else {
            return '';
        }
    }
    /**
     * This creates the native nextflow launch commands
     * @param path The GA4GH Tool's path
     * @param versionName The ToolVersion's name
     */
    getNextflowNativeLaunchString(workflowPath: string, versionName: string) {
      return `$ nextflow run http://${workflowPath} -r ${versionName} -with-docker`;
    }

    /**
     * Gets the wget test parameter file command
     *
     * @param {string} entryPath     The entry path
     * @param {string} versionName   The workflow version
     * @param {string} type          The descriptor type (cwl, wdl, nfl)
     * @param {string} filePath      Relative file path of the the test parameter file
     * @returns {string}             The wget command
     * @memberof LaunchService
     */
    getTestJsonString(entryPath: string, versionName: string, type: string, filePath: string): string {
      if (!filePath) {
        return;
      }
      let urlType = 'PLAIN_NFL';
      switch (type) {
        case 'wdl':
          urlType = 'PLAIN_WDL';
          break;
        case 'cwl':
          urlType = 'PLAIN_CWL';
          break;
        case 'nfl':
          urlType = 'PLAIN_NFL';
          break;
        default:
          console.error('Unknown descriptor type: ' + type);
          return null;
      }

      const prefix = `$ wget --header='Accept: text/plain`;
      const outputFile = `-O Dockstore.json`;
      const id = encodeURIComponent(entryPath);
      const versionId = encodeURIComponent(versionName);

      // Encode the '../' only
      const re = new RegExp('\\.\\./', 'g');
      const relativePath = filePath.replace(re, encodeURIComponent('../'));

      const url = `${Dockstore.API_URI}${ga4ghPath}/tools/${id}/versions/${versionId}/${urlType}/descriptor/${relativePath}`;
      return `${prefix}' ${url} ${outputFile}`;
    }
}

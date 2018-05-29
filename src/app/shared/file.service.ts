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
import { ga4ghPath } from './constants';
import { Dockstore } from './dockstore.model';
import { WorkflowVersion, Tag, SourceFile } from './swagger';

export class FileService {


    /**
     * Get the download path of a descriptor
     * TODO: Convert to pipe
     * @param {string} entryPath         the entry's path (e.g. "quay.io/pancancer/pcawg-dkfz-workflow")
     * @param {string} entryVersion      the version object of the entry
     * @param {string} sourceFile        the SourceFile object
     * @param {string} descriptorType    the descriptor type (e.g. "cwl")
     * @param {string} entryType         the entry type, either "tool" or "workflow"
     * @returns {string}                 the url to download the test parameter file
     * @memberof FileService
     */
    getDescriptorPath(entryPath: string, entryVersion: (Tag | WorkflowVersion), sourceFile: SourceFile,
      descriptorType: string, entryType: string): string {
      if (!entryPath || !entryVersion || !sourceFile || !descriptorType || !entryType) {
        return null;
      } else {
        let type = '';
        switch (descriptorType) {
          case 'wdl':
            type = 'PLAIN-WDL';
            break;
          case 'cwl':
            type = 'PLAIN-CWL';
            break;
          default:
            console.log('Unhandled type: ' + descriptorType);
            return null;
        }
        return this.getDownloadFilePath(entryPath, entryVersion.name, sourceFile.path, type, entryType);
      }
    }

    /**
     * Get the download path of a test parameter file
     * TODO: Convert to pipe
     * @private
     * @param {string} entryPath         the entry's path (e.g. "quay.io/pancancer/pcawg-dkfz-workflow")
     * @param {string} version           the version of the entry (e.g. "2.0.1_cwl1.0")
     * @param {string} filePath          path of the file (e.g. "/Dockstore.json")
     * @param {string} type              the string used for the GA4GH type (e.g. "PLAIN_CWL", "PLAIN_TEST_WDL_FILE")
     * @param {string} entryType         the entry type, either "tool" or "workflow"
     * @returns {string}
     * @memberof FileService
     */
    private getDownloadFilePath(entryPath: string, version: string, filePath: string, type: string, entryType: string): string {
      const basepath = Dockstore.API_URI + ga4ghPath + '/tools/';
      let entry = '';
      if (entryType === 'workflow') {
        entry = encodeURIComponent('#workflow/' + entryPath);
      } else {
        entry = encodeURIComponent(entryPath);
      }
      // Do not encode the filePath because webservice can handle an unencoded file path.  Also the default file name is prettier this way
      const customPath =  entry + '/versions/' + encodeURIComponent(version) + '/'
        + type + '/descriptor/' + filePath;
      return basepath + customPath;
    }

    // Get the path of the file
    getFilePath(file): string {
      if (file != null) {
        return file.path;
      }
      return null;
    }
}

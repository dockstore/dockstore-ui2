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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ga4ghPath, ga4ghWorkflowIdPrefix } from './constants';
import { Dockstore } from './dockstore.model';
import { SourceFile, Tag, WorkflowVersion, ToolDescriptor } from './swagger';
import { DescriptorTypeCompatService } from './descriptor-type-compat.service';

@Injectable()
export class FileService {
  constructor(private sanitizer: DomSanitizer, private descriptorTypeCompatService: DescriptorTypeCompatService) { }

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
    descriptorType: ToolDescriptor.TypeEnum, entryType: string): string {
    if (!entryPath || !entryVersion || !sourceFile || !descriptorType || !entryType) {
      return null;
    } else {
      let type = '';
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.WDL:
          type = 'PLAIN-WDL';
          break;
        case ToolDescriptor.TypeEnum.CWL:
          type = 'PLAIN-CWL';
          break;
        case ToolDescriptor.TypeEnum.NFL:
          type = 'PLAIN-NFL';
          break;
        default:
          console.error('Unhandled descriptor type: ' + descriptorType);
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
      entry = encodeURIComponent(ga4ghWorkflowIdPrefix + entryPath);
    } else {
      entry = encodeURIComponent(entryPath);
    }
    // Do not encode the filePath because webservice can handle an unencoded file path.  Also the default file name is prettier this way
    const customPath = entry + '/versions/' + encodeURIComponent(version) + '/'
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

  /**
   * Constructing the custom download link involves setting 2 attributes ('href' and 'download')
   * This gets the 'href' attribute
   * @param {string} content  The file contents
   * @returns {SafeUrl}    What to set for the 'href' attribute
   * @memberof FileService
   */
  getFileData(content: string): SafeUrl {
    if (content) {
      return this.sanitizer.bypassSecurityTrustUrl('data:text/plain,' + encodeURIComponent(content));
    } else {
      return null;
    }
  }

  /**
   * Constructing the custom download link involves setting 2 attributes ('href' and 'download')
   * This gets the 'download' attribute
   * @param {string} path  Full path of the file
   * @returns {string}     What to set for the 'download' attribute
   * @memberof FileService
   */
  getFileName(path: string): string {
    if (path) {
      let filename = 'dockstore.txt';
      const splitFileName = (path).split('/');
      filename = splitFileName[splitFileName.length - 1];
      return filename;
    } else {
      return null;
    }
  }
}

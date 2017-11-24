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
 import { Dockstore } from './dockstore.model';

export class FileService {

    /* Highlight Code */
    highlightCode(code: string): string {
      return '<pre><code class="yaml highlight">' + code + '</pre></code>';
    }

    // Get the download path of a descriptor
    getDescriptorPath(entrypath, currentVersion, currentFile, descriptor, entrytype): string {
      if (currentFile != null) {
        const basepath = Dockstore.API_URI + '/api/ga4gh/v1/tools/';
        let descriptorType = 'plain-CWL';
        if (descriptor === 'wdl') {
          descriptorType = 'plain-WDL';
        }

        let entry = '';
        if (entrytype === 'workflow') {
          entry = encodeURIComponent('#workflow/' + entrypath);
        } else {
          entry = encodeURIComponent(entrypath);
        }

        const customPath =  entry + '/versions/' + currentVersion.name + '/'
          + descriptorType + '/descriptor/' + encodeURIComponent(currentFile.path);
        return basepath + customPath;
      } else {
        return null;
      }
    }

    // Downloads a file
    // TODO: Temporary, need to update test param endpoint to return raw file based on path
    downloadFile(file, id): void {
      let filename = 'dockstore.txt';
      if (file != null) {
        const splitFileName = (file.path).split('/');
        filename = splitFileName[splitFileName.length - 1];
      }
      const data = 'data:text/plain,' + encodeURIComponent(file.content);

      $('#' + id).attr('href', data).attr('download', filename);
    }

    // Get the path of the file
    getFilePath(file): string {
      if (file != null) {
        return file.path;
      }
      return null;
    }
}

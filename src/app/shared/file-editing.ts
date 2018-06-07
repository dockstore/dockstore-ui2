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

import { Input } from '@angular/core';
import { Files } from './files.ts';

export class FileEditing extends Files {
  /**
   * Toggles edit mode
   * @return
   */
  toggleEdit() {
    this.editing = !this.editing;
  }

  /**
   * Retrieves all dockerfiles from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getDockerFile(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'DOCKERFILE');
  }

  /**
   * Retrieves all descriptor files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return  {Array<SourceFile>}     Array of descriptor files
   */
  getDescriptorFiles(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'DOCKSTORE_WDL' || sourcefile.type === 'DOCKSTORE_CWL');
  }

  /**
   * Retrieves all test parameter files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getTestFiles(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'WDL_TEST_JSON' || sourcefile.type === 'CWL_TEST_JSON');
  }

  /**
   * Common code between tools and workflows for saving
   * @param originalSourceFiles Sourcefiles from previous version (unedited)
   * @param newSourceFiles Current set of sourcefiles
   * @return A list of sourcefiles for the version to be added
   */
  commonSaveVersion(originalSourceFiles, newSourceFiles) {
    const sourceFilesToDelete = [];

    // Deal with file renames
    for (const originalSourceFile of originalSourceFiles) {
      let toDelete = true;
      for (const newSourceFile of newSourceFiles) {
        if (newSourceFile.path === originalSourceFile.path) {
          toDelete = false;
          break;
        }
      }

      if (toDelete) {
        const sourceFileCopy = originalSourceFile;
        sourceFileCopy.content = null;
        sourceFilesToDelete.push(sourceFileCopy);
      }
    }

    if (sourceFilesToDelete.length > 0) {
      newSourceFiles = newSourceFiles.concat(sourceFilesToDelete);
    }

    return newSourceFiles;
  }
}

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

import { Directive } from '@angular/core';
import { AlertService } from './alert/state/alert.service';
import { Files } from './files';
import { SourceFile } from './openapi';
import { Tag, WorkflowVersion } from './swagger';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class FileEditing extends Files {
  /**
   * Toggles edit mode
   * @return
   */
  toggleEdit() {
    this.editing = !this.editing;
  }

  constructor(protected alertService: AlertService) {
    super();
  }

  handleNoContentResponse() {
    this.alertService.detailedSuccess('Version did not change (no changes detected in file contents)');
  }

  /**
   * Retrieves all dockerfiles from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getDockerFile(sourceFiles: Array<SourceFile>): Array<SourceFile> {
    return sourceFiles.filter((sourcefile) => sourcefile.type === SourceFile.TypeEnum.DOCKERFILE);
  }

  /**
   * Retrieves all descriptor files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return  {Array<SourceFile>}     Array of descriptor files
   */
  getDescriptorFiles(sourceFiles: Array<SourceFile>): Array<SourceFile> {
    return sourceFiles.filter(
      (sourcefile) =>
        sourcefile.type === SourceFile.TypeEnum.DOCKSTORESMK ||
        sourcefile.type === SourceFile.TypeEnum.DOCKSTOREWDL ||
        sourcefile.type === SourceFile.TypeEnum.DOCKSTORECWL ||
        sourcefile.type === SourceFile.TypeEnum.NEXTFLOWCONFIG ||
        // DOCKSTORE-2428 - demo how to add new workflow language
        // sourcefile.type === SourceFile.TypeEnum.DOCKSTORESWL ||
        sourcefile.type === SourceFile.TypeEnum.NEXTFLOW ||
        sourcefile.type === SourceFile.TypeEnum.DOCKSTOREGXFORMAT2
    );
  }

  /**
   * Retrieves all test parameter files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getTestFiles(sourceFiles: Array<SourceFile>): Array<SourceFile> {
    return sourceFiles.filter(
      (sourcefile) =>
        sourcefile.type === SourceFile.TypeEnum.SMKTESTPARAMS ||
        sourcefile.type === SourceFile.TypeEnum.WDLTESTJSON ||
        sourcefile.type === SourceFile.TypeEnum.CWLTESTJSON ||
        // DOCKSTORE-2428 - demo how to add new workflow language
        // sourcefile.type === SourceFile.TypeEnum.SWLTESTJSON ||
        sourcefile.type === SourceFile.TypeEnum.NEXTFLOWTESTPARAMS ||
        sourcefile.type === SourceFile.TypeEnum.GXFORMAT2TESTFILE
    );
  }

  /**
   * Common code between tools and workflows for saving
   * @param originalSourceFiles Sourcefiles from previous version (unedited)
   * @param newSourceFiles Current set of sourcefiles
   * @return A list of sourcefiles for the version to be added
   */
  commonSaveVersion(originalSourceFiles: Array<SourceFile>, newSourceFiles: Array<SourceFile>): Array<SourceFile> {
    const sourceFilesToDelete = [];

    // Deal with file renames
    for (const originalSourceFile of originalSourceFiles) {
      const matchingPath = newSourceFiles.find((x) => x.path === originalSourceFile.path);
      if (matchingPath === undefined) {
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
  /**
   * Getting the newest workflowVersion based on the id
   */

  getNewestVersion(versions: Array<WorkflowVersion | Tag>): WorkflowVersion | Tag {
    return versions.reduce((p, c) => (p.id > c.id ? p : c));
  }

  deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }
}

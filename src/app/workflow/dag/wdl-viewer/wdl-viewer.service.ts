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
import { OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ga4ghWorkflowIdPrefix } from '../../../shared/constants';
import { FileService } from '../../../shared/file.service';
import { Files } from '../../../shared/files';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { FileWrapper, GA4GHService, ToolDescriptor, ToolFile } from '../../../shared/swagger';
import { FilesService } from '../../files/state/files.service';
import { FilesQuery } from '../../files/state/files.query';

/**
 * Abstract class to be implemented by components that have select boxes for a given entry and version
 */
export abstract class WdlViewerService extends Files implements OnDestroy {
  _selectedVersion: any;

  protected currentDescriptor: ToolDescriptor.TypeEnum;
  protected descriptors: Array<any>;
  public nullDescriptors: boolean;
  public currentFile;
  public files: Array<ToolFile>;
  public published$: Observable<boolean>;
  protected abstract entryType: ('tool' | 'workflow');
  protected abstract workflow: ExtendedWorkflow;

  abstract getDescriptors(version): Array<any>;
  abstract getFiles(descriptor): Observable<any>;

  constructor(protected fileService: FileService, protected gA4GHFilesService: GA4GHFilesService,
              protected gA4GHService: GA4GHService, protected filesService: FilesService, protected filesQuery: FilesQuery) {
    super();
  }

  onVersionChange(value) {
    this._selectedVersion = value;
    this.reactToVersion();
  }

  reactToVersion(): void {
    this.descriptors = this.getDescriptors(this._selectedVersion);
    if (this.descriptors) {
      this.nullDescriptors = false;
      if (this.descriptors.length) {
        this.onDescriptorChange(this.descriptors[0]);
      }
    } else {
      this.nullDescriptors = true;
    }
  }

  onDescriptorChange(descriptor) {
    this.currentDescriptor = descriptor;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  /**
   * Stores a File object into the Files entity store
   *
   * @memberof WdlViewerService
   */
  protected storeFileDescriptor(currFile: ToolFile): void {
    this.gA4GHFilesService.injectAuthorizationToken(this.gA4GHService);
    const existingFileWrapper = this.filesQuery.getEntity(currFile.path);

    // If the current file does not exist, retrieve file using Swagger-generated API wrapper and place into the store
    if (!existingFileWrapper) {
      this.gA4GHService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(this.currentDescriptor,
        this.entryType === 'workflow' ? ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path : this.workflow.full_workflow_path,
        this._selectedVersion.name, currFile.path).subscribe((file: FileWrapper) => {
        this.filesService.update(currFile.path, file);
      });
    }
  }
}

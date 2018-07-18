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
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { FileService } from '../../shared/file.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolDescriptor, ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowDescriptorService } from './workflow-descriptor.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})
export class DescriptorsWorkflowComponent extends EntryFileSelector {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }

  public descriptorPath: string;
  constructor(private workflowDescriptorService: WorkflowDescriptorService, private gA4GHService: GA4GHService,
    public fileService: FileService, private gA4GHFilesStateService: GA4GHFilesStateService,
    private workflowService: WorkflowService) {
    super(fileService);
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.workflowDescriptorService.getDescriptors(this._selectedVersion);
  }

  /**
   * Get all the primary or secondary descriptors
   *
   * @param {*} descriptor  This actually doesn't matter
   * @returns {Observable<Array<ToolFile>>}  The array of primary or secondary descriptor ToolFiles
   * @memberof DescriptorsWorkflowComponent
   */
  getFiles(descriptor): Observable<Array<ToolFile>> {
    return this.gA4GHFilesStateService.descriptorToolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
      return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR ||
        toolFile.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR);
    }));

  }

  reactToFile(): void {
    // TODO: Memoize this
    this.gA4GHService.defaultHeaders = this.gA4GHService.defaultHeaders.set('Authorization',
    this.gA4GHService.configuration.apiKeys['Authorization']);
    this.gA4GHService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(this.currentDescriptor, '#workflow/' + this.entrypath,
      this._selectedVersion.name, this.currentFile.path).subscribe((file: ToolDescriptor) => {
        this.content = file.descriptor;
        this.downloadFilePath = this.getDescriptorPath(this.entrypath, 'workflow');
        this.filePath = this.fileService.getFilePath(this.currentFile);
      });
  }
}

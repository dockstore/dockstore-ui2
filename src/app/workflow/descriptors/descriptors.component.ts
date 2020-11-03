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
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { AlertService } from '../../shared/alert/state/alert.service';
import { DescriptorService } from '../../shared/descriptor.service';
import { FileService } from '../../shared/file.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { EntriesService, GA4GHV20Service } from '../../shared/openapi';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { SourceFile, ToolDescriptor, ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { FilesQuery } from '../files/state/files.query';
import { FilesService } from '../files/state/files.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css'],
})
export class DescriptorsWorkflowComponent extends EntryFileSelector implements OnChanges {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;
  @Input() selectedVersion: WorkflowVersion;

  protected entryType: 'tool' | 'workflow' = 'workflow';

  constructor(
    private descriptorService: DescriptorService,
    public gA4GHService: GA4GHV20Service,
    public fileService: FileService,
    protected gA4GHFilesService: GA4GHFilesService,
    private workflowQuery: WorkflowQuery,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    protected filesService: FilesService,
    protected filesQuery: FilesQuery,
    protected entryService: EntriesService,
    protected alertService: AlertService
  ) {
    super(fileService, gA4GHFilesService, gA4GHService, filesService, filesQuery, entryService, alertService);
    this.published$ = this.workflowQuery.workflowIsPublished$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onVersionChange(this.selectedVersion, this.id);
    this.checkIfValid(true, this.selectedVersion);
  }

  getDescriptors(version: WorkflowVersion): Array<ToolDescriptor.TypeEnum> {
    return this.descriptorService.getDescriptors(this._selectedVersion, this.versionsFileTypes);
  }

  getValidDescriptors(version: WorkflowVersion): Array<any> {
    return this.descriptorService.getValidDescriptors(this._selectedVersion);
  }

  /**
   * Get all the primary or secondary descriptors
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @returns {Observable<Array<ToolFile>>}  The array of primary or secondary descriptor ToolFiles
   * @memberof DescriptorsWorkflowComponent
   */
  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [
      ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR,
    ]);
  }
}

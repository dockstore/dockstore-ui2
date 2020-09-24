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

import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { AlertService } from '../../shared/alert/state/alert.service';
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
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css'],
})
export class ParamfilesWorkflowComponent extends EntryFileSelector implements OnChanges {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;
  @Input() selectedVersion: WorkflowVersion;

  public isNFL$: Observable<boolean>;
  protected entryType: 'tool' | 'workflow' = 'workflow';
  public downloadFilePath: string;

  constructor(
    private paramfilesService: ParamfilesService,
    protected gA4GHService: GA4GHV20Service,
    public fileService: FileService,
    protected gA4GHFilesService: GA4GHFilesService,
    private workflowQuery: WorkflowQuery,
    private workflowService: WorkflowQuery,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    protected filesService: FilesService,
    protected filesQuery: FilesQuery,
    protected entryService: EntriesService,
    protected alertService: AlertService
  ) {
    super(fileService, gA4GHFilesService, gA4GHService, filesService, filesQuery, entryService, alertService);
    this.published$ = this.workflowService.workflowIsPublished$;
    this.isNFL$ = this.workflowQuery.isNFL$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearContent();
    this.onVersionChange(this.selectedVersion, this.id);
    this.checkIfValid(false, this.selectedVersion);
  }

  getDescriptors(version: WorkflowVersion): Array<ToolDescriptor.TypeEnum> {
    return this.paramfilesService.getDescriptors(this.versionsFileTypes);
  }

  getValidDescriptors(version: WorkflowVersion): Array<any> {
    return this.paramfilesService.getValidDescriptors(this._selectedVersion, this.versionsFileTypes);
  }

  /**
   * Get all the test parameter files
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  This actually doesn't matter for the workflow components.
   * Both tool and workflows uses the same abstract method, but only tool can have multiple descriptor types.
   * Workflows won't use this until it also supports having multiple descriptor types.
   * @returns {Observable<Array<ToolFile>>}  The array of test parameter ToolFiles
   * @memberof ParamfilesWorkflowComponent
   */
  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.TESTFILE]);
  }
}

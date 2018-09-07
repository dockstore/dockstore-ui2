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

import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { FileService } from '../../shared/file.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { WorkflowService } from '../../shared/workflow.service';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css']
})
export class ParamfilesWorkflowComponent extends EntryFileSelector {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() descriptorType: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.clearContent();
    this.onVersionChange(value);
  }
  protected entryType: ('tool' | 'workflow') = 'workflow';
  public downloadFilePath: string;

  constructor(private paramfilesService: ParamfilesService, protected gA4GHService: GA4GHService,
    public fileService: FileService, protected gA4GHFilesStateService: GA4GHFilesStateService,
    private workflowService: WorkflowService) {
    super(fileService, gA4GHFilesStateService, gA4GHService);
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  /**
   * Get all the test parameter files
   *
   * @param {*} descriptor  This actually doesn't matter for the workflow components.
   * Both tool and workflows uses the same abstract method, but only tool can have multiple descriptor types.
   * Workflows won't use this until it also supports having multiple descriptor types.
   * @returns {Observable<Array<ToolFile>>}  The array of test parameter ToolFiles
   * @memberof ParamfilesWorkflowComponent
   */
  getFiles(descriptor): Observable<Array<ToolFile>> {
    return this.gA4GHFilesStateService.testToolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
      return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.TESTFILE);
    }));
  }
}

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
import { FileService } from '../../shared/file.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolDescriptor, ToolFile } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolQuery } from '../../shared/tool/tool.query';
import { FilesQuery } from '../../workflow/files/state/files.query';
import { FilesService } from '../../workflow/files/state/files.service';
import { ParamfilesService } from './paramfiles.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.scss']
})
export class ParamfilesComponent extends EntryFileSelector {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() publicPage: boolean;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
    this.checkIfValid(false, value);
  }
  public filePath: string;
  protected entryType: 'tool' | 'workflow' = 'tool';
  public downloadFilePath: string;
  constructor(
    protected gA4GHService: GA4GHService,
    private paramfilesService: ParamfilesService,
    protected gA4GHFilesService: GA4GHFilesService,
    public fileService: FileService,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    private toolQuery: ToolQuery,
    protected filesService: FilesService,
    protected filesQuery: FilesQuery
  ) {
    super(fileService, gA4GHFilesService, gA4GHService, filesService, filesQuery);
    this.published$ = this.toolQuery.toolIsPublished$;
  }

  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  getValidDescriptors(version): Array<any> {
    return this.paramfilesService.getValidDescriptors(this._selectedVersion);
  }

  /**
   * Get all the language-specific test parameter files

   * @param {ToolDescriptor.TypeEnum} descriptorType  The descriptor language selected
   * @returns {Observable<Array<ToolFile>>}  The array of language-specific test parameter files
   * @memberof ParamfilesComponent
   */
  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.TESTFILE]);
  }
}

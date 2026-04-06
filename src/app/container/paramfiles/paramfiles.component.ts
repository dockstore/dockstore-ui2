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
import { FileService } from '../../shared/file.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { EntriesService, GA4GHV20Service, SourceFile, ToolDescriptor, ToolFile } from '../../shared/openapi';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { Tag } from '../../shared/openapi/model/tag';
import { ToolQuery } from '../../shared/tool/tool.query';
import { FilesQuery } from '../../workflow/files/state/files.query';
import { FilesService } from '../../workflow/files/state/files.service';
import { ParamfilesService } from './paramfiles.service';
import { CodeEditorComponent } from '../../shared/code-editor/code-editor.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../../shared/snackbar.directive';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectComponent } from '../../select/select.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, AsyncPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    NgFor,
    MatProgressBarModule,
    SelectComponent,
    MatToolbarModule,
    FlexModule,
    MatButtonModule,
    SnackbarDirective,
    ClipboardModule,
    CodeEditorComponent,
    AsyncPipe,
    KeyValuePipe,
  ],
})
export class ParamfilesComponent extends EntryFileSelector implements OnChanges {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() publicPage: boolean;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;
  @Input() selectedVersion: Tag;

  public filePath: string;
  protected entryType: 'tool' | 'workflow' = 'tool';
  public downloadFilePath: string;
  constructor(
    protected gA4GHService: GA4GHV20Service,
    private paramfilesService: ParamfilesService,
    protected gA4GHFilesService: GA4GHFilesService,
    public fileService: FileService,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    private toolQuery: ToolQuery,
    protected filesService: FilesService,
    protected filesQuery: FilesQuery,
    protected entryService: EntriesService,
    protected alertService: AlertService
  ) {
    super(fileService, gA4GHFilesService, gA4GHService, filesService, filesQuery, entryService, alertService);
    this.published$ = this.toolQuery.toolIsPublished$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearContent();
    this.onVersionChange(this.selectedVersion, this.id);
    this.checkIfValid(false, this.selectedVersion);
  }

  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.versionsFileTypes);
  }

  getValidDescriptors(version): Array<any> {
    return this.paramfilesService.getValidDescriptors(this._selectedVersion, this.versionsFileTypes);
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

  downloadFileContent() {
    this.fileService.downloadFileContent(this.content, this.customDownloadPath);
  }
}

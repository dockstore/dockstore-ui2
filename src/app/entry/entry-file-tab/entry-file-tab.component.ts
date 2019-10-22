import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SafeUrl } from '@angular/platform-browser';
import { Base } from 'app/shared/base';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { ToolFile, WorkflowVersion } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { EntryFileTabQuery } from './state/entry-file-tab.query';
import { EntryFileTabService } from './state/entry-file-tab.service';
import { EntryFileTabStore } from './state/entry-file-tab.store';

/**
 * Only uses the TRS endpoints to display files
 * TODO: Missing file caching and eager loading first file on each file type
 *
 * @export
 * @class EntryFileTabComponent
 * @extends {Base}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-entry-file-tab',
  templateUrl: './entry-file-tab.component.html',
  styleUrls: ['./entry-file-tab.component.scss'],
  providers: [EntryFileTabService, EntryFileTabStore, EntryFileTabQuery]
})
export class EntryFileTabComponent extends Base implements OnInit {
  @Input() version: WorkflowVersion;
  selectedFile$: Observable<ToolFile>;
  published$: Observable<boolean>;
  downloadFilePath$: Observable<string>;
  customDownloadHREF$: Observable<SafeUrl>;
  customDownloadPath$: Observable<string>;
  fileTypes$: Observable<ToolFile.FileTypeEnum[]>;
  files$: Observable<ToolFile[]>;
  fileContents$: Observable<string>;
  downloadButtonTooltip$: Observable<string>;
  loading$: Observable<boolean>;
  validationMessage$: Observable<Object>;
  constructor(
    private workflowQuery: WorkflowQuery,
    private entryFileTabQuery: EntryFileTabQuery,
    private entryFileTabService: EntryFileTabService
  ) {
    super();
  }

  ngOnInit() {
    this.selectedFile$ = this.entryFileTabQuery.selectedFile$;
    this.files$ = this.entryFileTabQuery.files$;
    this.downloadFilePath$ = this.entryFileTabQuery.downloadFilePath$;
    this.downloadButtonTooltip$ = this.entryFileTabQuery.downloadButtonTooltip$;
    this.fileContents$ = this.entryFileTabQuery.fileContents$;
    this.customDownloadHREF$ = this.entryFileTabQuery.customDownloadHREF$;
    this.customDownloadPath$ = this.entryFileTabQuery.customDownloadPath$;
    this.fileTypes$ = this.entryFileTabQuery.fileTypes$;
    this.published$ = this.workflowQuery.workflowIsPublished$;
    this.loading$ = this.entryFileTabQuery.selectLoading();
    this.validationMessage$ = this.entryFileTabQuery.validationMessage$;
    this.entryFileTabService.init();
  }

  matTabChange(event: MatTabChangeEvent) {
    const fileType: ToolFile.FileTypeEnum = this.entryFileTabQuery.getValue().fileTypes[event.index];
    this.entryFileTabService.changeFileType(fileType);
  }

  matSelectChange(event: MatSelectChange) {
    this.entryFileTabService.changeFile(event.value);
  }
}

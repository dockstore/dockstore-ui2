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
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { FileService } from 'app/shared/file.service';
import { Author, WorkflowsService, ToolDescriptor } from 'app/shared/openapi';
import { OrcidAuthorInformation } from 'app/shared/openapi/model/orcidAuthorInformation';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { Dockstore } from '../../shared/dockstore.model';
import { EntryTab } from '../../shared/entry/entry-tab';
import { ExtendedWorkflowsService } from '../../shared/extended-workflows.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { Workflow } from '../../shared/openapi/model/workflow';
import { WorkflowVersion } from '../../shared/openapi/model/workflowVersion';
import { Tooltip } from '../../shared/tooltip';
import { validationDescriptorPatterns } from '../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { VersionProviderUrlPipe } from '../../shared/entry/versionProviderUrl.pipe';
import { BaseUrlPipe } from '../../shared/entry/base-url.pipe';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { MarkdownWrapperComponent } from '../../shared/markdown-wrapper/markdown-wrapper.component';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { InfoTabCheckerWorkflowPathComponent } from '../../shared/entry/info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { AiBubbleComponent } from '../../shared/ai-bubble/ai-bubble.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../../shared/snackbar.directive';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, TitleCasePipe } from '@angular/common';
import { DisplayTopicComponent } from 'app/shared/entry/info-tab-topic/display-topic/display-topic.component';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['../../shared/styles/info-tab.component.scss', './info-tab.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyCardModule,
    MatDividerModule,
    MatLegacyTooltipModule,
    MatLegacyButtonModule,
    SnackbarDirective,
    ClipboardModule,
    MatIconModule,
    FormsModule,
    FlexModule,
    AiBubbleComponent,
    MatLegacyRadioModule,
    InfoTabCheckerWorkflowPathComponent,
    NgFor,
    MatLegacyTableModule,
    ExtendedModule,
    NgClass,
    MarkdownWrapperComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    AsyncPipe,
    TitleCasePipe,
    MapFriendlyValuesPipe,
    BaseUrlPipe,
    VersionProviderUrlPipe,
    DisplayTopicComponent,
  ],
})
export class InfoTabComponent extends EntryTab implements OnInit, OnChanges {
  @Input() validVersions;
  @Input() defaultVersion;
  // This should represent what's in the database
  @Input() extendedWorkflow: ExtendedWorkflow;
  // This is what the user is currently seeing/editing
  public workflow: ExtendedWorkflow;
  currentVersion: WorkflowVersion;
  downloadZipLink: string;
  publicAccessibleTestParameterFile: boolean | null;
  isValidVersion = false;
  @Input() selectedVersion: WorkflowVersion;

  public validationPatterns = validationDescriptorPatterns;
  public WorkflowType = Workflow;
  public TopicSelectionEnum = Workflow.TopicSelectionEnum;
  public tooltip = Tooltip;
  public description: string | null;
  workflowPathEditing: boolean;
  temporaryDescriptorType: Workflow.DescriptorTypeEnum;
  descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  defaultTestFilePathEditing: boolean;
  forumUrlEditing: boolean;
  topicEditing: boolean;
  isPublic: boolean;
  trsLink: string;
  sourceCodeFile: string;
  displayTextForButton: string;
  displayedColumns: string[] = ['name', 'role', 'affiliation', 'email', 'orcid_id'];
  authors: (Author | OrcidAuthorInformation)[] = [];
  EntryType = EntryType;
  descriptorType$: Observable<ToolDescriptor.TypeEnum | string>;
  isNFL$: Observable<boolean>;
  ToolDescriptor = ToolDescriptor;
  public hasHttpImports: boolean = false;
  public entryType$: Observable<EntryType>;
  public isRefreshing$: Observable<boolean>;
  modeTooltipContent = `STUB: Basic metadata pulled from source control.
  FULL: Full content synced from source control.
  HOSTED: Workflow metadata and files hosted on Dockstore.`;
  Dockstore = Dockstore;
  constructor(
    private workflowService: WorkflowService,
    private extendedWorkflowsService: ExtendedWorkflowsService,
    private workflowsService: WorkflowsService,
    private sessionQuery: SessionQuery,
    private infoTabService: InfoTabService,
    private alertQuery: AlertQuery,
    private workflowQuery: WorkflowQuery,
    private descriptorLanguageService: DescriptorLanguageService,
    private fileService: FileService
  ) {
    super();
    this.entryType$ = this.sessionQuery.entryType$.pipe(shareReplay());
  }

  ngOnChanges(changes: SimpleChanges) {
    // This should be enabled when the language parsers are fully functional
    // this.hasHttpImports = this.selectedVersion?.versionMetadata?.parsedInformationSet[0]?.hasHTTPImports ?? false;
    // ngOnChanges seems to be fired twice. Once for most inputs, then another time for just canRead, canWrite, isOwner
    if ((changes.selectedVersion || changes.extendedWorkflow) && this.extendedWorkflow && this.selectedVersion) {
      this.workflowsService.getWorkflowVersionsSourcefiles(this.extendedWorkflow.id, this.selectedVersion.id).subscribe((sourceFiles) => {
        this.hasHttpImports = sourceFiles.some((sourceFile) => this.fileService.hasHttpImport(sourceFile));
      });
    }
    this.workflow = this.deepCopy(this.extendedWorkflow);
    this.temporaryDescriptorType = this.workflow.descriptorType;
    this.description = null;
    if (this.selectedVersion && this.workflow) {
      this.currentVersion = this.selectedVersion;
      this.publicAccessibleTestParameterFile = this.selectedVersion?.versionMetadata?.publicAccessibleTestParameterFile;
      this.trsLink = this.infoTabService.getTRSLink(
        this.workflow.full_workflow_path,
        this.selectedVersion.name,
        this.workflow.descriptorType,
        this.selectedVersion.workflow_path,
        this.sessionQuery.getValue().entryType
      );
      if (this.selectedVersion.workflow_path.charAt(0) === '/') {
        this.sourceCodeFile = this.selectedVersion.workflow_path.slice(1); //removes first slash to prevent from displaying on text
      } else {
        this.sourceCodeFile = this.selectedVersion.workflow_path;
      }
      const found = this.validVersions.find((version: WorkflowVersion) => version.id === this.selectedVersion.id);
      this.isValidVersion = found ? true : false;
      this.downloadZipLink = Dockstore.API_URI + '/workflows/' + this.workflow.id + '/zip/' + this.currentVersion.id;
      this.authors = []; // Clear authors so the previous authors are not displayed if the getWorkflowVersionOrcidAuthors call is slow or fails
      this.workflowsService.getWorkflowVersionOrcidAuthors(this.workflow.id, this.selectedVersion.id).subscribe((orcidAuthors) => {
        this.authors = [...this.selectedVersion.authors, ...orcidAuthors];
      });
      this.workflowsService
        .getWorkflowVersionDescription(this.workflow.id, this.selectedVersion.id)
        .subscribe((description) => (this.description = description));
    } else {
      this.currentVersion = null;
      this.publicAccessibleTestParameterFile = null;
      this.trsLink = null;
      this.sourceCodeFile = null;
      this.isValidVersion = null;
      this.downloadZipLink = null;
      this.authors = null;
      this.description = null;
    }
  }

  ngOnInit() {
    this.descriptorLanguages$ = this.descriptorLanguageService.filteredDescriptorLanguages$;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isPublic) => (this.isPublic = isPublic));
    this.infoTabService.workflowPathEditing$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((editing) => (this.workflowPathEditing = editing));
    this.infoTabService.defaultTestFilePathEditing$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((editing) => (this.defaultTestFilePathEditing = editing));
    this.entryType$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((entryType) => (this.displayTextForButton = this.infoTabService.getTRSId(this.workflow, entryType)));
    this.infoTabService.forumUrlEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.forumUrlEditing = editing));
  }
  /**
   * Handle restubbing a workflow
   * TODO: Handle restub error
   *
   * @memberof InfoTabComponent
   */
  restubWorkflow() {
    this.extendedWorkflowsService.restub(this.workflow.id).subscribe((restubbedWorkflow: Workflow) => {
      this.workflowService.setWorkflow(restubbedWorkflow);
      this.workflowService.upsertWorkflowToWorkflow(restubbedWorkflow);
    });
  }

  downloadZip() {
    this.extendedWorkflowsService
      .getWorkflowZip(this.workflow.id, this.currentVersion.id, 'response')
      .subscribe((data: HttpResponse<any>) => {
        const blob = new Blob([data.body], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

  toggleEditWorkflowPath() {
    if (this.workflowPathEditing) {
      this.save();
    }
    this.infoTabService.setWorkflowPathEditing(!this.workflowPathEditing);
  }

  toggleEditDefaultTestFilePath() {
    if (this.defaultTestFilePathEditing) {
      this.save();
    }
    this.infoTabService.setDefaultTestFilePathEditing(!this.defaultTestFilePathEditing);
  }

  toggleEditForumUrl() {
    if (this.forumUrlEditing) {
      this.save();
    }
    this.infoTabService.setForumUrlEditing(!this.forumUrlEditing);
  }

  save() {
    this.infoTabService.updateAndRefresh(this.workflow);
  }

  update() {
    this.infoTabService.update(this.workflow);
  }

  updateDescriptorType() {
    this.infoTabService.updateDescriptorType(this.workflow, this.temporaryDescriptorType);
  }

  /**
   * Cancel button function
   *
   * @memberof InfoTabComponent
   */
  cancelEditing(): void {
    this.infoTabService.cancelEditing();
    this.workflow = this.deepCopy(this.extendedWorkflow);
  }

  private deepCopy(workflow: ExtendedWorkflow): ExtendedWorkflow {
    return JSON.parse(JSON.stringify(this.extendedWorkflow));
  }
}

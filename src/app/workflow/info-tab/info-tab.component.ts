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
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { recommendGitHubApps } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { EntryTab } from '../../shared/entry/entry-tab';
import { ExtendedWorkflowsService } from '../../shared/extended-workflows.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { ToolDescriptor } from '../../shared/swagger';
import { Workflow } from '../../shared/swagger/model/workflow';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { Tooltip } from '../../shared/tooltip';
import { validationDescriptorPatterns } from '../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css'],
})
export class InfoTabComponent extends EntryTab implements OnInit, OnChanges {
  @Input() validVersions;
  @Input() defaultVersion;
  @Input() extendedWorkflow: ExtendedWorkflow;
  public workflow: Workflow;
  currentVersion: WorkflowVersion;
  downloadZipLink: string;
  isValidVersion = false;
  zenodoUrl: string;
  @Input() selectedVersion: WorkflowVersion;

  public validationPatterns = validationDescriptorPatterns;
  public WorkflowType = Workflow;
  public tooltip = Tooltip;
  workflowPathEditing: boolean;
  temporaryDescriptorType: Workflow.DescriptorTypeEnum;
  descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  defaultTestFilePathEditing: boolean;
  forumUrlEditing: boolean;
  isPublic: boolean;
  trsLink: string;
  displayTextForButton: string;
  EntryType = EntryType;
  descriptorType$: Observable<ToolDescriptor.TypeEnum | string>;
  isNFL$: Observable<boolean>;
  ToolDescriptor = ToolDescriptor;
  public entryType$: Observable<EntryType>;
  public isRefreshing$: Observable<boolean>;
  public recommendGitHubApps = recommendGitHubApps;
  Dockstore = Dockstore;
  constructor(
    private workflowsService: ExtendedWorkflowsService,
    private sessionQuery: SessionQuery,
    private infoTabService: InfoTabService,
    private alertQuery: AlertQuery,
    private workflowQuery: WorkflowQuery,
    private descriptorLanguageService: DescriptorLanguageService
  ) {
    super();
    this.entryType$ = this.sessionQuery.entryType$.pipe(shareReplay());
  }

  ngOnChanges() {
    this.workflow = JSON.parse(JSON.stringify(this.extendedWorkflow));
    this.temporaryDescriptorType = this.workflow.descriptorType;
    if (this.selectedVersion && this.workflow) {
      this.currentVersion = this.selectedVersion;
      this.trsLink = this.infoTabService.getTRSLink(
        this.workflow.full_workflow_path,
        this.selectedVersion.name,
        this.workflow.descriptorType,
        this.selectedVersion.workflow_path,
        this.sessionQuery.getValue().entryType
      );
      const found = this.validVersions.find((version: WorkflowVersion) => version.id === this.selectedVersion.id);
      this.isValidVersion = found ? true : false;
      this.downloadZipLink = Dockstore.API_URI + '/workflows/' + this.workflow.id + '/zip/' + this.currentVersion.id;
    } else {
      this.isValidVersion = false;
      this.trsLink = null;
    }
  }

  ngOnInit() {
    this.zenodoUrl = Dockstore.ZENODO_AUTH_URL ? Dockstore.ZENODO_AUTH_URL.replace('oauth/authorize', '') : '';
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
      .subscribe((entryType) => (this.displayTextForButton = '#' + entryType + '/' + this.workflow?.full_workflow_path));
    this.infoTabService.forumUrlEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.forumUrlEditing = editing));
  }

  downloadZip() {
    this.workflowsService.getWorkflowZip(this.workflow.id, this.currentVersion.id, 'response').subscribe((data: HttpResponse<any>) => {
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
  }
}

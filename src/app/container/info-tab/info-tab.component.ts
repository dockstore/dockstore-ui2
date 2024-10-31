/**
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
import { Base } from 'app/shared/base';
import { takeUntil } from 'rxjs/operators';
import { ga4ghPath } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { ExtendedToolsService } from '../../shared/extended-tools.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { SessionQuery } from '../../shared/session/session.query';
import { ToolDescriptor, ToolVersion, WorkflowVersion, Author, ContainertagsService } from '../../shared/openapi';
import { DockstoreTool } from '../../shared/openapi/model/dockstoreTool';
import { Tag } from '../../shared/openapi/model/tag';
import { exampleDescriptorPatterns, validationDescriptorPatterns } from '../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { BaseUrlPipe } from '../../shared/entry/base-url.pipe';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { UrlDeconstructPipe } from '../../shared/entry/url-deconstruct.pipe';
import { VersionProviderUrlPipe } from '../../shared/entry/versionProviderUrl.pipe';
import { MarkdownWrapperComponent } from '../../shared/markdown-wrapper/markdown-wrapper.component';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { InfoTabCheckerWorkflowPathComponent } from '../../shared/entry/info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
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
import { NgIf, NgClass } from '@angular/common';

import DescriptorTypeEnum = ToolVersion.DescriptorTypeEnum;
import { DisplayTopicComponent } from 'app/shared/entry/info-tab-topic/display-topic/display-topic.component';

@Component({
  selector: 'app-info-tab-container',
  templateUrl: './info-tab.component.html',
  styleUrls: ['../../shared/styles/info-tab.component.scss'],
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
    MatLegacyTableModule,
    ExtendedModule,
    NgClass,
    MarkdownWrapperComponent,
    VersionProviderUrlPipe,
    UrlDeconstructPipe,
    MapFriendlyValuesPipe,
    BaseUrlPipe,
    DisplayTopicComponent,
  ],
})
export class InfoTabComponent extends Base implements OnInit, OnChanges {
  currentVersion: Tag;
  @Input() validVersions: Array<WorkflowVersion | Tag>;
  @Input() selectedVersion: Tag;
  @Input() privateOnlyRegistry: boolean;
  @Input() extendedDockstoreTool: ExtendedDockstoreTool;
  public description: string | null;
  public validationPatterns = validationDescriptorPatterns;
  public exampleDescriptorPatterns = exampleDescriptorPatterns;
  public DockstoreToolType = DockstoreTool;
  public tool: ExtendedDockstoreTool;
  public canWrite: boolean;
  public TopicSelectionEnum = DockstoreTool.TopicSelectionEnum;
  public authors: Array<Author> = [];
  public displayedColumns: string[] = ['name', 'role', 'affiliation', 'email'];
  dockerFileEditing: boolean;
  cwlPathEditing: boolean;
  wdlPathEditing: boolean;
  cwlTestPathEditing: boolean;
  wdlTestPathEditing: boolean;
  isPublic: boolean;
  trsLinkCWL: string;
  trsLinkWDL: string;
  downloadZipLink: string;
  isValidVersion = false;
  Dockstore = Dockstore;
  constructor(
    private infoTabService: InfoTabService,
    private sessionQuery: SessionQuery,
    private containersService: ExtendedToolsService,
    private containerTagsService: ContainertagsService
  ) {
    super();
  }

  ngOnChanges() {
    this.tool = JSON.parse(JSON.stringify(this.extendedDockstoreTool));
    this.canWrite = !this.tool.archived;
    this.description = null;
    if (this.selectedVersion && this.tool) {
      this.authors = this.selectedVersion.authors;
      this.currentVersion = this.selectedVersion;
      this.isValidVersion = this.validVersions.some((version: Tag) => version.id === this.selectedVersion.id);
      this.downloadZipLink = Dockstore.API_URI + '/containers/' + this.tool.id + '/zip/' + this.currentVersion.id;
      if (this.tool.descriptorType.includes(DescriptorTypeEnum.CWL)) {
        this.trsLinkCWL = this.getTRSLink(
          this.tool.tool_path,
          this.currentVersion.name,
          ToolDescriptor.TypeEnum.CWL,
          this.currentVersion.cwl_path
        );
      }
      if (this.tool.descriptorType.includes(DescriptorTypeEnum.WDL)) {
        this.trsLinkWDL = this.getTRSLink(
          this.tool.tool_path,
          this.currentVersion.name,
          ToolDescriptor.TypeEnum.WDL,
          this.currentVersion.wdl_path
        );
      }
      this.containerTagsService
        .getTagDescription(this.tool.id, this.selectedVersion.id)
        .subscribe((description) => (this.description = description));
    } else {
      this.isValidVersion = false;
      this.trsLinkCWL = null;
      this.trsLinkWDL = null;
    }
  }

  ngOnInit() {
    this.infoTabService.dockerFileEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.dockerFileEditing = editing));
    this.infoTabService.cwlPathEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.cwlPathEditing = editing));
    this.infoTabService.wdlPathEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.wdlPathEditing = editing));
    this.infoTabService.cwlTestPathEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.cwlTestPathEditing = editing));
    this.infoTabService.wdlTestPathEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((editing) => (this.wdlTestPathEditing = editing));
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((publicPage) => (this.isPublic = publicPage));
  }

  downloadZip() {
    this.containersService.getToolZip(this.tool.id, this.currentVersion.id, 'response').subscribe((data: HttpResponse<any>) => {
      const blob = new Blob([data.body], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  toggleEditDockerFile() {
    if (this.dockerFileEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setDockerFileEditing(!this.dockerFileEditing);
  }

  toggleEditCWLPath() {
    if (this.cwlPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setCWLPathEditing(!this.cwlPathEditing);
  }

  toggleEditWDLPath() {
    if (this.wdlPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setWDLPathEditing(!this.wdlPathEditing);
  }

  toggleEditCWLTestPath() {
    if (this.cwlTestPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setCWLTestPathEditing(!this.cwlTestPathEditing);
  }
  toggleEditWDLTestPath() {
    if (this.wdlTestPathEditing) {
      this.infoTabService.updateAndRefresh(this.tool);
    }
    this.infoTabService.setWDLTestPathEditing(!this.wdlTestPathEditing);
  }

  somethingIsBeingEdited(): boolean {
    return this.dockerFileEditing || this.cwlPathEditing || this.wdlPathEditing || this.cwlTestPathEditing || this.wdlTestPathEditing;
  }

  /**
   * Cancel button function
   *
   * @memberof InfoTabComponent
   */
  cancelEditing(): void {
    this.infoTabService.cancelEditing();
  }

  /**
   * Returns a link to the primary descriptor for the given tool version
   * @param path tool path
   * @param versionName name of version
   * @param descriptorType descriptor type (CWL or WDL)
   * @param descriptorPath primary descriptor path
   */
  getTRSLink(path: string, versionName: string, descriptorType: ToolDescriptor.TypeEnum, relativePath: string): string {
    return (
      `${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent(path)}` +
      `/versions/${encodeURIComponent(versionName)}/PLAIN_` +
      descriptorType +
      `/descriptor/` +
      relativePath
    );
  }
}

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
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContainerService } from '../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { SessionQuery } from '../../shared/session/session.query';
import { ContainertagsService } from '../../shared/swagger/api/containertags.service';
import { HostedService } from '../../shared/swagger/api/hosted.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { ToolQuery } from '../../shared/tool/tool.query';
import { View } from '../../shared/view';
import { VersionModalService } from '../version-modal/version-modal.service';
import { VersionModalComponent } from '../version-modal/version-modal.component';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
// This is actually the tag edtior
export class ViewContainerComponent extends View implements OnInit {
  public TagEditorMode = TagEditorMode;
  public tool: DockstoreTool;
  public DockstoreToolType = DockstoreTool;
  isPublic$: Observable<boolean>;
  isManualTool: boolean;
  constructor(
    dateService: DateService,
    private versionModalService: VersionModalService,
    private sessionQuery: SessionQuery,
    private containerService: ContainerService,
    private containertagsService: ContainertagsService,
    private hostedService: HostedService,
    private toolQuery: ToolQuery,
    private matDialog: MatDialog
  ) {
    super(dateService);
  }

  setMode(mode: TagEditorMode) {
    this.versionModalService.setVersion(this.version);
    this.versionModalService.setCurrentMode(mode);
    const dialogRef = this.matDialog.open(VersionModalComponent, { width: '600px' });
  }

  deleteTag() {
    const deleteMessage = 'Are you sure you want to delete tag ' + this.version.name + ' for tool ' + this.tool.tool_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.containertagsService.deleteTags(this.tool.id, this.version.id).subscribe(deleteResponse => {
        this.containertagsService.getTagsByPath(this.tool.id).subscribe(response => {
          this.tool.workflowVersions = response;
          this.containerService.setTool(this.tool);
        });
      });
    }
  }

  deleteHostedTag(): void {
    const deleteMessage = 'Are you sure you want to delete tag ' + this.version.name + ' for tool ' + this.tool.tool_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.hostedService
        .deleteHostedToolVersion(this.tool.id, this.version.name)
        .subscribe(
          (updatedTool: DockstoreTool) => this.containerService.setTool(updatedTool),
          (error: HttpErrorResponse) => console.log(error)
        );
    }
  }

  ngOnInit() {
    this.isPublic$ = this.sessionQuery.isPublic$;
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
      this.tool = JSON.parse(JSON.stringify(tool));
      if (this.tool) {
        this.isManualTool = this.tool.mode === DockstoreTool.ModeEnum.MANUALIMAGEPATH;
      } else {
        this.isManualTool = undefined;
      }
    });
  }
}

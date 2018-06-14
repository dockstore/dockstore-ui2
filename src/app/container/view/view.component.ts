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

import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { ContainerService } from './../../shared/container.service';
import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { StateService } from './../../shared/state.service';
import { VersionModalService } from './../version-modal/version-modal.service';
import { DateService } from './../../shared/date.service';
import { Component, OnInit } from '@angular/core';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { View } from '../../shared/view';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
// This is actually the tag edtior
export class ViewContainerComponent extends View implements OnInit {
  public TagEditorMode = TagEditorMode;
  private tool: DockstoreTool;
  public DockstoreToolType = DockstoreTool;
  isPublic: boolean;
  constructor(dateService: DateService, private versionModalService: VersionModalService, private stateService: StateService,
    private containerService: ContainerService, private containertagsService: ContainertagsService, private hostedService: HostedService) {
    super(dateService);
  }

  setMode(mode: TagEditorMode) {
    this.versionModalService.setVersion(this.version);
    this.versionModalService.setCurrentMode(mode);
    this.versionModalService.setIsModalShown(true);
  }

  deleteTag() {
    const deleteMessage = 'Are you sure you want to delete tag ' + this.version.name + ' for tool ' + this.tool.tool_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.containertagsService.deleteTags(this.tool.id, this.version.id).subscribe(
        deleteResponse => {
          this.containertagsService.getTagsByPath(this.tool.id).subscribe(response => {
            this.tool.tags = response;
            this.containerService.setTool(this.tool);
          });
        });
    }
  }

  deleteHostedTag(): void {
    const deleteMessage = 'Are you sure you want to delete tag ' + this.version.name + ' for tool ' + this.tool.tool_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.hostedService.deleteHostedToolVersion(this.tool.id, this.version.name).subscribe(
        (result: DockstoreTool) => {
            this.containerService.setTool(result);
          }, (error: HttpErrorResponse) => {
            console.log(error);
          });
    }
  }

  isManualTool(): boolean {
    return this.tool.mode === DockstoreTool.ModeEnum.MANUALIMAGEPATH;
  }

  ngOnInit() {
    this.stateService.publicPage$.subscribe(isPublic => this.isPublic = isPublic);
    this.containerService.tool$.subscribe(tool => this.tool = tool);
  }
}

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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContainerService } from '../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { RefreshService } from '../../shared/refresh.service';
import { StateService } from '../../shared/state.service';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { Tag } from '../../shared/swagger/model/tag';
import { Versions } from '../../shared/versions';
import { MatDialog } from '@angular/material';
import { AddTagComponent } from '../add-tag/add-tag.component';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsContainerComponent extends Versions implements OnInit {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  versionTag: Tag;
  public DockstoreToolType = DockstoreTool;
  @Input() set selectedVersion(value: Tag) {
    if (value != null) {
      this.versionTag = value;
    }
  }
  @Output() selectedVersionChange = new EventEmitter<Tag>();
  tool: any;

  constructor(dockstoreService: DockstoreService, private containersService: ContainersService,
    dateService: DateService, private refreshService: RefreshService, private matDialog: MatDialog,
    protected stateService: StateService,
    private containerService: ContainerService) {
    super(dockstoreService, dateService, stateService);
  }

  ngOnInit() {
    this.publicPageSubscription();
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.defaultVersion = tool.defaultVersion;
      }
    });
  }

  isManualMode() {
    if (this.tool && this.tool.mode === DockstoreTool.ModeEnum.MANUALIMAGEPATH) {
      return true;
    } else {
      return false;
    }
  }

  setNoOrderCols(): Array<number> {
    return [5, 6];
  }

  updateDefaultVersion(newDefaultVersion: string): void {
    if (this.publicPage) {
      return;
    }
    const message = 'Updating default tool version';
    this.stateService.setRefreshMessage(message + '...');
    this.containersService.updateToolDefaultVersion(this.tool.id, newDefaultVersion).subscribe(response => {
      this.refreshService.handleSuccess(message);
      if (this.tool.mode !== this.DockstoreToolType.ModeEnum.HOSTED) {
        this.refreshService.refreshTool();
      }
    }, error => this.refreshService.handleError(message, error));
  }

  getVerifiedSource(name: string) {
    this.dockstoreService.getVerifiedSource(name, this.verifiedSource);
  }

  // Updates the version and emits an event for the parent component
  setVersion(version: Tag) {
    this.versionTag = version;
    this.selectedVersionChange.emit(this.versionTag);
  }

  showAddTagModal() {
    this.matDialog.open(AddTagComponent, {width: '600px'});
  }
}

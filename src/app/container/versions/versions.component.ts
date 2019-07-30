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
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreToolQuery } from '../../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { RefreshService } from '../../shared/refresh.service';
import { SessionQuery } from '../../shared/session/session.query';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { Tag } from '../../shared/swagger/model/tag';
import { Versions } from '../../shared/versions';
import { AddTagComponent } from '../add-tag/add-tag.component';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsContainerComponent extends Versions implements OnInit {
  @Input() versions: Array<any>;
  versionTag: Tag;
  public DockstoreToolType = DockstoreTool;
  @Input() set selectedVersion(value: Tag) {
    if (value != null) {
      this.versionTag = value;
    }
  }
  @Output() selectedVersionChange = new EventEmitter<Tag>();
  tool: ExtendedDockstoreTool;

  constructor(
    dockstoreService: DockstoreService,
    private containersService: ContainersService,
    dateService: DateService,
    private refreshService: RefreshService,
    private alertService: AlertService,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery,
    private matDialog: MatDialog,
    protected sessionQuery: SessionQuery
  ) {
    super(dockstoreService, dateService, sessionQuery);
    this.sortColumn = 'last_built';
  }

  ngOnInit() {
    this.publicPageSubscription();
    this.extendedDockstoreToolQuery.extendedDockstoreTool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool: ExtendedDockstoreTool) => {
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
    this.alertService.start(message);
    this.containersService.updateToolDefaultVersion(this.tool.id, newDefaultVersion).subscribe(
      response => {
        this.alertService.detailedSuccess();
        if (this.tool.mode !== this.DockstoreToolType.ModeEnum.HOSTED) {
          this.refreshService.refreshTool();
        }
      },
      error => this.alertService.detailedError(error)
    );
  }

  // Updates the version and emits an event for the parent component
  setVersion(version: Tag) {
    this.versionTag = version;
    this.selectedVersionChange.emit(this.versionTag);
  }

  showAddTagModal() {
    this.matDialog.open(AddTagComponent, { width: '600px' });
  }
}

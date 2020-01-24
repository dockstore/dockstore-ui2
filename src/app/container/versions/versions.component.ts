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
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ContainerService } from 'app/shared/container.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreToolQuery } from '../../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { SessionQuery } from '../../shared/session/session.query';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { Tag } from '../../shared/swagger/model/tag';
import { Versions } from '../../shared/versions';
import { AddTagComponent } from '../add-tag/add-tag.component';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: ['./../../workflow/versions/versions.component.css']
})
export class VersionsContainerComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  @Input() versions: Array<any>;
  Dockstore = Dockstore;
  versionTag: Tag;
  public DockstoreToolType = DockstoreTool;
  dataSource = new MatTableDataSource(this.versions);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
    private alertService: AlertService,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery,
    private matDialog: MatDialog,
    protected sessionQuery: SessionQuery,
    private containerService: ContainerService
  ) {
    super(dockstoreService, dateService, sessionQuery);
    this.sortColumn = 'last_built';
    this.displayedColumns = ['name', 'reference', 'last_built', 'valid', 'hidden', 'verified', 'actions'];
  }

  ngOnInit() {
    this.publicPageSubscription();
    this.extendedDockstoreToolQuery.extendedDockstoreTool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool: ExtendedDockstoreTool) => {
      this.tool = tool;
      if (tool) {
        this.defaultVersion = tool.defaultVersion;
        this.setDisplayedColumnsFromTool(tool);
      }
    });
  }

  setDisplayColumns(publicPage: boolean) {
    if (publicPage) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'hidden');
    }
  }

  setDisplayedColumnsFromTool(tool: ExtendedDockstoreTool) {
    if (tool.mode === DockstoreTool.ModeEnum.HOSTED) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'last_built');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.versions;
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
        this.containerService.replaceTool(null, response);
        this.containerService.setTool(response);
      },
      error => this.alertService.detailedError(error)
    );
  }

  // Updates the version and emits an event for the parent component
  setVersion(version: Tag) {
    this.versionTag = version;
    this.alertService.start('Changing version to ' + version.name);
    this.alertService.detailedSuccess();
    this.selectedVersionChange.emit(this.versionTag);
  }

  showAddTagModal() {
    this.matDialog.open(AddTagComponent, { width: '600px' });
  }
}

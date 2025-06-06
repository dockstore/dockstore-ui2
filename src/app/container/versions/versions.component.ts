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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreToolQuery } from '../../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { VersionVerifiedPlatform, Tag } from '../../shared/openapi';
import { SessionQuery } from '../../shared/session/session.query';
import { DockstoreTool } from '../../shared/openapi/model/dockstoreTool';
import { Versions } from '../../shared/versions';
import { DescriptorLanguageVersionsPipe } from '../../shared/entry/descriptor-language-versions.pipe';
import { VerifiedPlatformsPipe } from '../../shared/entry/verified-platforms.pipe';
import { CommitUrlPipe } from '../../shared/entry/commit-url.pipe';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { ViewContainerComponent } from '../view/view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatChipsModule } from '@angular/material/chips';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgClass, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: ['./../../workflow/versions/versions.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    FlexModule,
    MatChipsModule,
    FontAwesomeModule,
    ViewContainerComponent,
    NgClass,
    ExtendedModule,
    DatePipe,
    CommitUrlPipe,
    VerifiedPlatformsPipe,
    DescriptorLanguageVersionsPipe,
  ],
})
export class VersionsContainerComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  faTag = faTag;
  faCodeBranch = faCodeBranch;
  @Input() versions: Array<any>;
  @Input() verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  Dockstore = Dockstore;
  selectedTag: Tag;
  public DockstoreToolType = DockstoreTool;
  dataSource = new MatTableDataSource(this.versions);
  @ViewChild(MatSort) sort: MatSort;
  @Input() set selectedVersion(value: Tag) {
    if (value != null) {
      this.selectedTag = value;
    }
  }
  @Output() selectedVersionChange = new EventEmitter<Tag>();
  tool: ExtendedDockstoreTool;

  constructor(
    dockstoreService: DockstoreService,
    dateService: DateService,
    private alertService: AlertService,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery,
    protected sessionQuery: SessionQuery
  ) {
    super(dockstoreService, dateService, sessionQuery);
    this.sortColumn = 'last_built';
    this.displayedColumns = ['name', 'reference', 'last_built', 'descriptorTypeVersions', 'valid', 'hidden', 'verified', 'actions'];
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
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'hidden');
    }
  }

  setDisplayedColumnsFromTool(tool: ExtendedDockstoreTool) {
    if (tool.mode === DockstoreTool.ModeEnum.HOSTED) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'last_built');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.versions;
  }

  setNoOrderCols(): Array<number> {
    return [5, 6];
  }

  // Updates the version and emits an event for the parent component
  setVersion(version: Tag) {
    this.selectedTag = version;
    this.alertService.start('Changing version to ' + version.name);
    this.alertService.detailedSuccess();
    this.selectedVersionChange.emit(this.selectedTag);
  }
}

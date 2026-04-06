import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../base';
import { VersionVerifiedPlatform, Tag, WorkflowVersion } from '../openapi';
import { ToolTesterLog } from '../openapi/model/toolTesterLog';
import { AvailableLogsQuery } from '../state/available-logs.query';
import { AvailableLogsService } from '../state/available-logs.service';
import { CheckerWorkflowQuery } from '../state/checker-workflow.query';
import { RemoveExtensionPipe } from './remove-extension.pipe';
import { ToolTesterLogPipe } from './tool-tester-log.pipe';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { VerifiedDisplayComponent } from '../entry/verified-display/verified-display.component';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../loading/loading.component';

interface VersionVerifiedInformation {
  version: WorkflowVersion | Tag;
  verifiedByPlatform: Array<VersionVerifiedPlatform>;
}

@Component({
  selector: 'app-available-logs',
  templateUrl: './available-logs.component.html',
  styleUrls: ['./available-logs.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    LoadingComponent,
    MatCardModule,
    NgIf,
    VerifiedDisplayComponent,
    MatTableModule,
    MatButtonModule,
    FlexModule,
    AsyncPipe,
    DatePipe,
    ToolTesterLogPipe,
    RemoveExtensionPipe,
  ],
})
export class AvailableLogsComponent extends Base implements OnInit {
  version: Tag | WorkflowVersion | null;
  verifiedByPlatform: Array<VersionVerifiedPlatform>;
  versionName: string | null;
  availableLogs$: Observable<ToolTesterLog[]>;
  isLoading$: Observable<boolean>;
  toolId$: Observable<string | null>;
  displayedColumns: string[] = ['testFilename', 'runner', 'filename', 'actions'];
  constructor(
    private availableLogsQuery: AvailableLogsQuery,
    private checkerWorkflowQuery: CheckerWorkflowQuery,
    private availableLogsService: AvailableLogsService,
    @Inject(MAT_DIALOG_DATA) public data: VersionVerifiedInformation
  ) {
    super();
    this.version = data.version;
    this.verifiedByPlatform = data.verifiedByPlatform;
    this.versionName = this.version ? this.version.name : null;
  }

  ngOnInit() {
    this.toolId$ = this.checkerWorkflowQuery.trsId$;
    this.toolId$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((toolId: string | null) => {
      if (this.versionName && toolId) {
        this.availableLogsService.get(toolId, this.versionName);
      } else {
        this.availableLogsService.removeAll();
      }
    });
    this.availableLogs$ = this.availableLogsQuery.selectAll();
    this.isLoading$ = this.availableLogsQuery.selectLoading();
  }

  add(availableLog: ToolTesterLog) {
    this.availableLogsService.add(availableLog);
  }

  update(id: ID, availableLog: Partial<ToolTesterLog>) {
    this.availableLogsService.update(id, availableLog);
  }

  remove(id: ID) {
    this.availableLogsService.remove(id);
  }
}

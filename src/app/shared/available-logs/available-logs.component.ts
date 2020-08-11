import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../base';
import { VersionVerifiedPlatform } from '../openapi';
import { ToolTesterLog } from '../openapi/model/toolTesterLog';
import { AvailableLogsQuery } from '../state/available-logs.query';
import { AvailableLogsService } from '../state/available-logs.service';
import { CheckerWorkflowQuery } from '../state/checker-workflow.query';
import { Tag, WorkflowVersion } from '../swagger';

interface VersionVerifiedInformation {
  version: WorkflowVersion | Tag;
  verifiedByPlatform: Array<VersionVerifiedPlatform>;
}

@Component({
  selector: 'available-logs',
  templateUrl: './available-logs.component.html',
  styleUrls: ['./available-logs.component.scss']
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

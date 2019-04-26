import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AvailableLogsQuery } from '../state/available-logs.query';
import { AvailableLogsService } from '../state/available-logs.service';
import { CheckerWorkflowQuery } from '../state/checker-workflow.query';
import { Tag, WorkflowVersion } from '../swagger';
import { ToolTesterLog } from '../swagger/model/toolTesterLog';

@Component({
  selector: 'available-logs',
  templateUrl: './available-logs.component.html',
  styleUrls: ['./available-logs.component.scss']
})
export class AvailableLogsComponent implements OnInit {
  version: Tag | WorkflowVersion;
  availableLogs$: Observable<ToolTesterLog[]>;
  isLoading$: Observable<boolean>;
  toolId: string;
  toolId$: Observable<string>;
  displayedColumns: string[] = ['testFilename', 'runner', 'filename', 'actions'];
  constructor(private availableLogsQuery: AvailableLogsQuery, private checkerWorkflowQuery: CheckerWorkflowQuery,
    private availableLogsService: AvailableLogsService, @Inject(MAT_DIALOG_DATA) public data: (Tag | WorkflowVersion)
  ) {
    this.version = data;
  }

  ngOnInit() {
    this.toolId$ = this.checkerWorkflowQuery.trsId$;
    this.toolId$.subscribe(toolId => {
      this.availableLogsService.get(toolId, this.version.name);
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

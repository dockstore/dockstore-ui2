import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LambdaEvent, LambdaEventsService } from 'app/shared/openapi';

@Component({
  selector: 'app-github-apps-logs',
  templateUrl: './github-apps-logs.component.html',
  styleUrls: ['./github-apps-logs.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class GithubAppsLogsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private lambdaEventsService: LambdaEventsService) {}
  columnsToDisplay: string[] = ['repository', 'reference', 'success', 'type'];
  displayedColumns: string[] = ['dbCreateDate', 'githubUsername', ...this.columnsToDisplay];
  lambdaEvents: LambdaEvent[];
  public LambdaEvent = LambdaEvent;
  expandedElement: LambdaEvent | null;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    console.log(this.data);
    this.lambdaEventsService.getLambdaEventsByOrganization(this.data).subscribe(lambdaEvents => (this.lambdaEvents = lambdaEvents));
  }
}

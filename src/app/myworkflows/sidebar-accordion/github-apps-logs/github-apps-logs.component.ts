import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LambdaEvent, LambdaEventsService } from 'app/shared/openapi';

@Component({
  selector: 'app-github-apps-logs',
  templateUrl: './github-apps-logs.component.html',
  styleUrls: ['./github-apps-logs.component.scss']
})
export class GithubAppsLogsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'githubUsername', 'repository', 'reference', 'success', 'type', 'message'];
  lambdaEvents: LambdaEvent[];
  public LambdaEvent = LambdaEvent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private lambdaEventsService: LambdaEventsService) {}

  ngOnInit() {
    console.log(this.data);
    this.lambdaEventsService.getLambdaEventsByOrganization(this.data).subscribe(lambdaEvents => (this.lambdaEvents = lambdaEvents));
  }
}

import { Component, OnInit } from '@angular/core';

import { WorkflowsService } from './workflows.service';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {

  dOptions = {};
  displayTable: boolean = false;

  publishedWorkflows = [];

  constructor(private workflowsService: WorkflowsService) { }

  ngOnInit() {
    this.workflowsService.getPublishedWorkflows()
      .subscribe(
        (publishedWorkflows) => {
          publishedWorkflows.map( workflow => {
          var gitUrl = workflow.gitUrl;

          workflow.provider = this.workflowsService.getProvider(gitUrl);
          workflow.providerUrl = this.workflowsService.getProviderUrl(gitUrl, workflow.provider);

          return workflow;
        });

        this.publishedWorkflows = publishedWorkflows;

        this.dOptions = this.publishedWorkflows;
        this.displayTable = true;
      }
    );
  }
}

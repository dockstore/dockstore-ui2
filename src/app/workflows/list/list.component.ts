import { Component, OnInit } from '@angular/core';

import { ListWorkflowsService } from './list.service';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent implements OnInit {

  displayTable = false;

  publishedWorkflows = [];

  constructor(private listWorkflowsService: ListWorkflowsService) { }

  ngOnInit() {
    this.listWorkflowsService.getPublishedWorkflows()
      .subscribe(
        (publishedWorkflows) => {
          publishedWorkflows.map( workflow => {
          const gitUrl = workflow.gitUrl;

          workflow.provider = this.listWorkflowsService.getProvider(gitUrl);
          workflow.providerUrl = this.listWorkflowsService.getProviderUrl(gitUrl, workflow.provider);

          return workflow;
        });

        this.publishedWorkflows = publishedWorkflows;

        this.displayTable = true;
      }
    );
  }
}

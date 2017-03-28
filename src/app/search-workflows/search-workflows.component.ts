import { Component, OnInit } from '@angular/core';

import { WorkflowsService } from './workflows.service';

@Component({
  selector: 'app-search-workflows',
  templateUrl: './search-workflows.component.html',
  styleUrls: ['./search-workflows.component.css'],
  providers: [WorkflowsService]
})
export class SearchWorkflowsComponent implements OnInit {

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

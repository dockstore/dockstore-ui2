import { Entry } from './../../swagger/model/entry';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';
import { Workflow } from './../../swagger/model/workflow';
import { validationDescriptorPatterns } from './../../validationMessages.model';
import { RegisterCheckerWorkflowService } from './../register-checker-workflow/register-checker-workflow.service';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.scss']
})
export class InfoTabCheckerWorkflowPathComponent implements OnInit {
  isPublic$: Observable<boolean>;
  hasParentEntry$: Observable<boolean>;
  checkerWorkflow$: Observable<Workflow>;
  constructor(private checkerWorkflowService: CheckerWorkflowService,
    private registerCheckerWorkflowService: RegisterCheckerWorkflowService) { }

  ngOnInit(): void {
    this.checkerWorkflow$ = this.checkerWorkflowService.checkerWorkflow$;
    this.hasParentEntry$ = this.checkerWorkflowService.hasParentEntry$;
    this.isPublic$ = this.checkerWorkflowService.publicPage$;
  }

  add(): void {
    this.registerCheckerWorkflowService.add();
  }

  view(): void {
    this.checkerWorkflowService.goToCheckerWorkflow();
  }

  delete(): void {
   this.registerCheckerWorkflowService.delete();
  }

  viewParentWorkflow(): void {
    this.checkerWorkflowService.goToParentEntry();
  }
}

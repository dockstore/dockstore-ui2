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
  checkerWorkflowPath$: Observable<string>;
  checkerWorkflowDefaultWorkflowPath$: Observable<string>;
  checkerWorkflowDefaultWorkflowPath: string;
  parentWorkflowPath$: Observable<string>;
  isPublic$: Observable<boolean>;
  editing = false;
  validationDescriptorPatterns = validationDescriptorPatterns;
  savedCheckerWorkflowDefaultWorkflowPath: string;
  hasChecker$: Observable<boolean>;
  parentEntry$: Observable<Entry>;
  hasParentEntry$: Observable<boolean>;
  constructor(private checkerWorkflowService: CheckerWorkflowService,
    private registerCheckerWorkflowService: RegisterCheckerWorkflowService) { }

  ngOnInit(): void {
    this.checkerWorkflowPath$ = this.checkerWorkflowService.checkerWorkflowPath$;
    this.parentWorkflowPath$ = this.checkerWorkflowService.parentWorkflowPath$;
    this.parentEntry$ = this.checkerWorkflowService.parentEntry$;
    this.hasParentEntry$ = this.checkerWorkflowService.hasParentEntry$;
    this.hasChecker$ = this.checkerWorkflowService.hasChecker$;
    this.checkerWorkflowDefaultWorkflowPath$ = this.checkerWorkflowService.checkerWorkflowDefaultWorkflowPath$;
    this.checkerWorkflowService.checkerWorkflowDefaultWorkflowPath$.subscribe((checkerWorkflowDefaultWorkflowPath: string) => {
      this.savedCheckerWorkflowDefaultWorkflowPath = checkerWorkflowDefaultWorkflowPath;
    });
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

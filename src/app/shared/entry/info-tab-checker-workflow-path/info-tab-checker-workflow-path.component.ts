import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';
import { validationPatterns } from './../../validationMessages.model';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.scss']
})
export class InfoTabCheckerWorkflowPathComponent implements OnInit {
  checkerWorkflowPath$: Observable<string>;
  checkerWorkflowDefaultWorkflowPath$: Observable<string>;
  checkerWorkflowDefaultWorkflowPath: string;
  isPublic$: Observable<boolean>;
  editing = false;
  validationPatterns = validationPatterns;
  savedCheckerWorkflowDefaultWorkflowPath: string;
  hasChecker$: Observable<boolean>;
  constructor(private checkerWorkflowService: CheckerWorkflowService) { }

  ngOnInit(): void {
    this.checkerWorkflowPath$ = this.checkerWorkflowService.checkerWorkflowPath$;
    this.hasChecker$ = this.checkerWorkflowService.hasChecker$;
    this.checkerWorkflowDefaultWorkflowPath$ = this.checkerWorkflowService.checkerWorkflowDefaultWorkflowPath$;
    this.checkerWorkflowService.checkerWorkflowDefaultWorkflowPath$.subscribe((checkerWorkflowDefaultWorkflowPath: string) => {
      this.savedCheckerWorkflowDefaultWorkflowPath = checkerWorkflowDefaultWorkflowPath;
      this.cancel();
    });
    this.isPublic$ = this.checkerWorkflowService.publicPage$;
  }

  /**
   * Cancel button
   */
  cancel(): void {
    this.checkerWorkflowDefaultWorkflowPath = this.savedCheckerWorkflowDefaultWorkflowPath;
    this.editing = false;
  }

  /**
   * Edit or Save button
   */
  toggleEditWorkflowPath(): void {
    this.editing = !this.editing;
    if (!this.editing) {
      this.save();
    }
  }

  /**
   * Save button
   */
  save(): void {
    this.checkerWorkflowService.save(this.checkerWorkflowDefaultWorkflowPath);
  }
}

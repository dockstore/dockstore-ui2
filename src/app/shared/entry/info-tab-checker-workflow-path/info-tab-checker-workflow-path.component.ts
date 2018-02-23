import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.scss']
})
export class InfoTabCheckerWorkflowPathComponent implements OnInit {
  checkerWorkflowPath: Observable<string>;
  constructor(private checkerWorkflowService: CheckerWorkflowService) { }

  ngOnInit() {
    this.checkerWorkflowPath = this.checkerWorkflowService.checkerWorkflowPath$;
  }
}

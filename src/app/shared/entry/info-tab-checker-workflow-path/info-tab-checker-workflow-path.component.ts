import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';
import { checkerWorkflowPathTooltip } from './../../info-tab-constants';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.css']
})
export class InfoTabCheckerWorkflowPathComponent implements OnInit {
  checkerWorkflowPath: Observable<string>;
  checkerWorkflowPathTooltip = checkerWorkflowPathTooltip;
  constructor(private checkerWorkflowService: CheckerWorkflowService) { }

  ngOnInit() {
    this.checkerWorkflowPath = this.checkerWorkflowService.checkerWorkflowPath$;
  }
}

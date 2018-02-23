import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';

@Component({
  selector: 'app-launch-checker-workflow',
  templateUrl: './launch-checker-workflow.component.html',
  styleUrls: ['./launch-checker-workflow.component.scss']
})
export class LaunchCheckerWorkflowComponent implements OnInit {
  @Input() command: string;
  command$: Observable<string>;
  checkerWorkflowPath$: Observable<string>;
  constructor(private checkerWorkflowService: CheckerWorkflowService) {
    this.checkerWorkflowPath$ = this.checkerWorkflowService.checkerWorkflowPath$;
  }

  ngOnInit() {
  }
}

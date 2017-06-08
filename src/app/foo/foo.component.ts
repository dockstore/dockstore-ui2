import {Component, Input, OnDestroy} from '@angular/core';
import { WorkflowObjService } from '../shared/workflow.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent implements OnDestroy {
  workflowName: string;
  subscription: Subscription;
  constructor(private workflowService: WorkflowObjService) {
    this.subscription = workflowService.workflowName$.subscribe(
      name => {
        this.workflowName = name;
      });
  }

  sayhi(input: string) {
    this.workflowService.sayhi(input);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WorkflowObjService {
  // Observable sources
  private workflowNameSource = new Subject<string>();
  private hiSource = new Subject<string>();
  private workflowSource = new Subject<any>();
  // Observable streams
  workflowName$ = this.workflowNameSource.asObservable();
  hi$  = this.hiSource.asObservable();
  workflow$ = this.workflowSource.asObservable();
  // Service msg commads
  updateName(name: string) {
    this.workflowNameSource.next(name);
  }
  updateWorkflow(workflow: any) {
    this.workflowSource.next(workflow);
  }
  sayhi(input) {
    this.hiSource.next(input);
  }
  constructor() { }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WorkflowObservableService {
  // Observable sources
  private workflowSource = new Subject<any>();
  // Observable streams
  workflow$ = this.workflowSource.asObservable();
  // Service msg commads
  setWorkflow(workflow: any) {
    this.workflowSource.next(workflow);
  }
  constructor() { }
}


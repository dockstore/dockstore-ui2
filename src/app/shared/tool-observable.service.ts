import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolObservableService {
  // Observable sources
  private toolSource = new Subject<any>();
  // Observable streams
  tool$ = this.toolSource.asObservable();
  // Service
  setTool(tool: any) {
    this.toolSource.next(tool);
  }
  constructor() { }
}

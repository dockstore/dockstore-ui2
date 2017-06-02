import {AfterViewChecked, AfterViewInit, Component, Input} from '@angular/core';

import { View } from '../../shared/view';

import { ViewService } from '../../container/view/view.service';
import { DateService } from '../../shared/date.service';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-view-workflow',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewWorkflowComponent extends View implements AfterViewInit{
  @Input() workflowId: string;
  items: any[];
  constructor(private viewService: ViewService,
              private workflowService: WorkflowService,
              dateService: DateService) {
    super(dateService);
  }
  initItems() {
    if (this.version) {
      this.workflowService.getTestJson(this.workflowId, this.version.name)
        .subscribe(items => {
          console.log(items);
            this.items = items;
          });
    }
  }
  getSizeString(size) {
    return this.viewService.getSizeString(size);
  }
  ngAfterViewInit() {
    this.initItems();
  }
}

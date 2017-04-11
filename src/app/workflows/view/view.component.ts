import { Component, Input, OnInit } from '@angular/core';

import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-view-workflow',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewWorkflowComponent implements OnInit {
  @Input() tag;

  constructor(private dockstoreService: DockstoreService) { }

  getDateTimeString(timestamp) {
    return this.dockstoreService.getDateTimeString(timestamp);
  }

  ngOnInit() {
  }

}

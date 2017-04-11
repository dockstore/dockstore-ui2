import { Component, Input, OnInit } from '@angular/core';

import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-versions-workflows',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent implements OnInit {
  @Input() tags: any;
  dtOptions = {
    bFilter: false,
    bPaginate: false,
    columnDefs: [
      {
        orderable: false,
        targets: [4, 5]
      }
    ]
  };

  constructor(private dockstoreService: DockstoreService) { }

  getDate(timestamp) {
    return this.dockstoreService.getDate(timestamp);
  }

  ngOnInit() { }

}

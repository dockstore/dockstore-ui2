import { Component, Input, OnInit } from '@angular/core';

import { ContainerService } from '../container/container.service';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsComponent implements OnInit {
  @Input() tags: any;
  dtOptions = {
    bFilter: false,
    bPaginate: false,
    columnDefs: [
      {
        orderable: false,
        targets: [5, 6]
      }
    ]
  };

  constructor(private containerService: ContainerService) { }

  getDate(timestamp) {
    return this.containerService.getDate(timestamp);
  }

  ngOnInit() { }

}

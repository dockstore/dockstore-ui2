import { Component, Input, OnInit } from '@angular/core';

import { ContainerService } from '../container/container.service';

@Component({
  selector: 'app-view-version',
  templateUrl: './view-version.component.html',
  styleUrls: ['./view-version.component.css']
})
export class ViewVersionComponent implements OnInit {
  @Input() tag;

  constructor(private containerService: ContainerService) { }

  getDateTimeString(timestamp) {
    return this.containerService.getDateTimeString(timestamp);
  }

  getSizeString(size) {
    return this.containerService.getSizeString(size);
  }

  ngOnInit() {
  }

}

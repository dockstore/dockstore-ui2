import { Component, Input, OnInit } from '@angular/core';

import { ContainerService } from '../container/container.service';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewContainerComponent implements OnInit {
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

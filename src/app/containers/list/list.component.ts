import { Component, OnInit } from '@angular/core';

import { ListContainersService } from './list.service';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListContainersComponent implements OnInit {

  displayTable = false;
  dtOptions = {
    columnDefs: [
      {
        orderable: false,
        targets: [2, 3]
      }
    ]
  };

  publishedTools = [];

  constructor(private listContainersService: ListContainersService) { }

  getFilteredDockerPullCmd(path: string): string {
    return this.listContainersService.getDockerPullCmd(path);
  }

  ngOnInit() {
    this.listContainersService.getPublishedTools()
      .subscribe(
        (publishedTools) => {
          publishedTools.map(tool => this.listContainersService.setProviders(tool));
          this.publishedTools = publishedTools;

          this.displayTable = true;
        }
      );
  }

}

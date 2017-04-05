import { Component, OnInit } from '@angular/core';

import { ContainersService } from './containers.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.css']
})
export class ContainersComponent implements OnInit {

  displayTable = false;

  publishedTools = [];

  constructor(private containersService: ContainersService) { }

  getFilteredDockerPullCmd(path: string): string {
    return this.containersService.getDockerPullCmd(path);
  }

  ngOnInit() {
    this.containersService.getPublishedTools()
      .subscribe(
        (publishedTools) => {
          publishedTools.map( tool => {
            const gitUrl = tool.gitUrl;

            tool.provider = this.containersService.getProvider(gitUrl);
            tool.providerUrl = this.containersService.getProviderUrl(gitUrl, tool.provider);

            return tool;
          });
          this.publishedTools = publishedTools;

          this.displayTable = true;
        }
      );
  }

}

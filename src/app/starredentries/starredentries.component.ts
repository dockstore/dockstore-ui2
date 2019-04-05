import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Base } from '../shared/base';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { StarentryService } from '../shared/starentry.service';
import { DockstoreTool, Workflow } from '../shared/swagger';
import { UserQuery } from '../shared/user/user.query';
import { StarringService } from '../starring/starring.service';
import { UsersService } from './../shared/swagger/api/users.service';

@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
})
export class StarredEntriesComponent extends Base implements OnInit {
  starredTools: any;
  starredWorkflows: any;
  user: any;
  starGazersClicked = false;
  selectedEntry: any;
  constructor(private starringService: StarringService,
              private userQuery: UserQuery,
              private imageProviderService: ImageProviderService,
              private providerService: ProviderService,
              private starentryService: StarentryService,
              private usersService: UsersService) {
                super();
               }

  ngOnInit() {
    this.starentryService.starEntry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      entry => {
        this.selectedEntry = entry;
      }
    );
    this.userQuery.user$.subscribe(user => this.user = user);
    this.usersService.getStarredTools().subscribe(
      starredTool => {
        this.starredTools = starredTool. filter((entry: DockstoreTool) => entry.is_published);
        this.starredTools.forEach(
          tool => {
            if (!tool.providerUrl) {
              this.providerService.setUpProvider(tool);
            }
            if (!tool.imgProviderUrl) {
              tool = this.imageProviderService.setUpImageProvider(tool);
            }
          });
      });
    this.usersService.getStarredWorkflows().subscribe(
      starredWorkflow => {
        this.starredWorkflows = starredWorkflow.filter((entry: Workflow) => entry.is_published);
        this.starredWorkflows.forEach(
          workflow => {
            if (!workflow.providerUrl) {
              this.providerService.setUpProvider(workflow);
            }
        });
      });
  }
  isOwner(entryUsers: any): boolean {
    let isOwner = false;
    if (this.user) {
      for (const user of entryUsers) {
        if (user.id === this.user.id) {
          isOwner = true;
          break;
        }
      }
    }
    return isOwner;
  }

  starGazersChange() {
    this.starGazersClicked = !this.starGazersClicked;
  }
}

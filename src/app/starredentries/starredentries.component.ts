import { UsersService } from './../shared/swagger/api/users.service';
import { Component, OnInit } from '@angular/core';
import { StarringService } from '../starring/starring.service';
import { ProviderService } from '../shared/provider.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { UserService } from '../loginComponents/user.service';
import {Subscription} from 'rxjs';
import { StarentryService } from '../shared/starentry.service';
import { Workflow, DockstoreTool } from '../shared/swagger';

@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
})
export class StarredEntriesComponent implements OnInit {
  starredTools: any;
  starredWorkflows: any;
  user: any;
  starGazersClicked = false;
  selectedEntry: any;
  private entrySubscription: Subscription;
  constructor(private starringService: StarringService,
              private userService: UserService,
              private imageProviderService: ImageProviderService,
              private providerService: ProviderService,
              private starentryService: StarentryService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.entrySubscription = this.starentryService.starEntry$.subscribe(
      entry => {
        this.selectedEntry = entry;
      }
    );
    this.userService.user$.subscribe(user => this.user = user);
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

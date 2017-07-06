import { Component, OnInit } from '@angular/core';
import { StarringService } from '../starring/starring.service';
import { ProviderService } from '../shared/provider.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { UserService } from '../loginComponents/user.service';
import {Subscription} from 'rxjs/Subscription';
import { StarentryService } from '../shared/starentry.service';
@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
})
export class StarredentriesComponent implements OnInit {
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
              private starentryService: StarentryService) { }

  ngOnInit() {
    this.entrySubscription = this.starentryService.starEntry$.subscribe(
      entry => {
        this.selectedEntry = entry;
      }
    );
    this.starringService.getStarredTools().subscribe(
      starredTool => {
        this.userService.getUser().subscribe(user => {
          this.user = user;
        });
        this.starredTools = starredTool;
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
    this.starringService.getStarredWorkflows().subscribe(
      starredWorkflow => {
        this.starredWorkflows = starredWorkflow;
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

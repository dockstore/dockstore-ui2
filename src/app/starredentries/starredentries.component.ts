import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/base';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { DockstoreTool, Entry, Organization, Workflow } from '../shared/swagger';
import { UserQuery } from '../shared/user/user.query';
import { UsersService } from './../shared/swagger/api/users.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UntypedFormControl } from '@angular/forms';
import { ExtendedDockstoreTool } from 'app/shared/models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from 'app/shared/models/ExtendedWorkflow';
// import { DockstoreService } from 'app/shared/dockstore.service';
import { OrgLogoService } from '../shared/org-logo.service';
import { EntryType } from '../shared/enum/entry-type';

@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
})
export class StarredEntriesComponent extends Base implements OnInit {
  selected = new UntypedFormControl(0);
  starredTools: Array<ExtendedDockstoreTool> | null;
  starredWorkflows: Array<ExtendedWorkflow> | null;
  starredServices: Array<Entry> | null;
  starredOrganizations: Array<Organization> | null;
  user: any;
  starGazersClicked = false;
  organizationStarGazersClicked = false;
  readonly entryType = EntryType;

  constructor(
    private userQuery: UserQuery,
    private imageProviderService: ImageProviderService,
    private providerService: ProviderService,
    private usersService: UsersService,
    // private dockstoreService: DockstoreService
    private orgLogoService: OrgLogoService
  ) {
    super();
  }

  ngOnInit() {
    this.userQuery.user$.subscribe((user) => (this.user = user));
    this.usersService.getStarredTools().subscribe((starredTool) => {
      this.starredTools = <ExtendedDockstoreTool[]>starredTool.filter((entry: DockstoreTool) => entry.is_published);
      this.starredTools.forEach((tool) => {
        this.providerService.setUpProvider(tool);
        tool = this.imageProviderService.setUpImageProvider(tool);
        // This doesn't work because there's no workflowVersions
        // tool.versionVerified = this.dockstoreService.getVersionVerified(tool.workflowVersions);
      });
    });
    this.usersService.getStarredWorkflows().subscribe((starredWorkflow) => {
      this.starredWorkflows = <ExtendedWorkflow[]>starredWorkflow.filter((entry: Workflow) => entry.is_published);
      this.starredWorkflows.forEach((workflow) => {
        this.providerService.setUpProvider(workflow);
        // This doesn't work because there's no workflowVersions
        // workflow.versionVerified = this.dockstoreService.getVersionVerified(workflow.workflowVersions);
      });
    });
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.starredOrganizations = starredOrganizations;
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

  organizationStarGazersChange() {
    this.organizationStarGazersClicked = !this.organizationStarGazersClicked;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selected.setValue(event.index);
  }
}

import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/base';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { DockstoreTool, Entry, Organization, Workflow, EntryType as OpenApiEntryType } from '../shared/openapi';
import { UserQuery } from '../shared/user/user.query';
import { UsersService } from './../shared/openapi/api/users.service';
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { UntypedFormControl } from '@angular/forms';
import { ExtendedDockstoreTool } from 'app/shared/models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from 'app/shared/models/ExtendedWorkflow';
import { OrgLogoService } from '../shared/org-logo.service';
import { EntryType } from '../shared/enum/entry-type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgIf, NgClass, NgFor, NgTemplateOutlet, SlicePipe, DatePipe } from '@angular/common';
import { Dockstore } from 'app/shared/dockstore.model';
import { DescriptorLanguagePipe } from '../shared/entry/descriptor-language.pipe';
import { BaseUrlPipe } from '../shared/entry/base-url.pipe';
import { RouterLinkPipe } from '../entry/router-link.pipe';
import { GravatarPipe } from '../gravatar/gravatar.pipe';
import { OrganizationStarringComponent } from '../organizations/organization/organization-starring/organization-starring.component';
import { ImgFallbackDirective } from '../shared/img-fallback.directive';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MarkdownWrapperComponent } from '../shared/markdown-wrapper/markdown-wrapper.component';
import { StarringComponent } from '../starring/starring.component';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { OrganizationStargazersComponent } from '../organizations/organization/organization-stargazers/organization-stargazers.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { StargazersComponent } from '../stargazers/stargazers.component';
import { HeaderComponent } from '../header/header.component';
import { MySidebarComponent } from '../my-sidebar/my-sidebar.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-starredentries',
  templateUrl: './starredentries.component.html',
  styleUrls: ['./starredentries.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    MySidebarComponent,
    HeaderComponent,
    NgIf,
    StargazersComponent,
    MatLegacyButtonModule,
    MatIconModule,
    OrganizationStargazersComponent,
    MatLegacyTabsModule,
    NgClass,
    ExtendedModule,
    MatLegacyCardModule,
    NgFor,
    NgTemplateOutlet,
    RouterLink,
    StarringComponent,
    MarkdownWrapperComponent,
    MatLegacyChipsModule,
    MatLegacyTooltipModule,
    ImgFallbackDirective,
    OrganizationStarringComponent,
    SlicePipe,
    DatePipe,
    GravatarPipe,
    RouterLinkPipe,
    BaseUrlPipe,
    DescriptorLanguagePipe,
  ],
})
export class StarredEntriesComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  starredTools: Array<ExtendedDockstoreTool | ExtendedWorkflow> | null;
  starredWorkflows: Array<ExtendedWorkflow> | null;
  starredServices: Array<Entry> | null;
  starredNotebooks: Array<ExtendedWorkflow> | null;
  starredOrganizations: Array<Organization> | null;
  user: any;
  starGazersClicked = false;
  organizationStarGazersClicked = false;
  readonly entryType = EntryType;
  // Default to workflows tab
  currentTab = 'workflows';
  selected = new UntypedFormControl();
  // TODO: Add 'services' to validTabs when implemented
  validTabs = ['workflows', 'tools', 'notebooks', 'organizations'];

  constructor(
    private userQuery: UserQuery,
    private imageProviderService: ImageProviderService,
    private providerService: ProviderService,
    private usersService: UsersService,
    public orgLogoService: OrgLogoService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.setupTab(params.tab);
    });

    this.userQuery.user$.subscribe((user) => (this.user = user));
    this.usersService.getStarredTools().subscribe((starredTool) => {
      this.starredTools = <(ExtendedDockstoreTool | ExtendedWorkflow)[]>starredTool.filter((entry: Entry) => entry.is_published);
      this.starredTools.forEach((tool) => {
        this.providerService.setUpProvider(tool);
        if (tool.entryType === OpenApiEntryType.TOOL) {
          this.imageProviderService.setUpImageProvider(tool as ExtendedDockstoreTool);
        }
      });
    });
    this.usersService.getStarredWorkflows().subscribe((starredWorkflow) => {
      this.starredWorkflows = <ExtendedWorkflow[]>starredWorkflow.filter((entry: Workflow) => entry.is_published);
      this.starredWorkflows.forEach((workflow) => {
        this.providerService.setUpProvider(workflow);
      });
    });
    this.usersService.getStarredNotebooks().subscribe((starredNotebook) => {
      this.starredNotebooks = <ExtendedWorkflow[]>starredNotebook.filter((entry: Workflow) => entry.is_published);
      this.starredNotebooks.forEach((workflow) => {
        this.providerService.setUpProvider(workflow);
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

  // Runs on first page load
  public setupTab(tabName: string) {
    const tabIndex = this.validTabs.indexOf(tabName);
    if (tabIndex >= 0) {
      this.currentTab = tabName;
    }
    this.selected.setValue(this.validTabs.indexOf(this.currentTab));
    this.updateStarredUrl(this.currentTab);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    this.currentTab = this.validTabs[matTabChangeEvent.index];
    this.updateStarredUrl(this.currentTab);
  }

  // Updates url query params
  updateStarredUrl(tabName: string) {
    this.location.replaceState('starred?tab=' + tabName);
  }

  protected readonly OpenApiEntryType = OpenApiEntryType;
}

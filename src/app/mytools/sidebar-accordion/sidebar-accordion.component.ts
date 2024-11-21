import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DockstoreTool } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { ToolQuery } from '../../shared/tool/tool.query';
import { OrgToolObject } from '../my-tool/my-tool.component';
import { KeyValue, NgFor, NgIf, NgTemplateOutlet, NgClass, AsyncPipe, KeyValuePipe } from '@angular/common';
import { MetadataService } from '../../shared/openapi/api/metadata.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { RefreshToolOrganizationComponent } from '../../container/refresh-tool-organization/refresh-tool-organization.component';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

interface GroupEntriesByRegistry {
  groupEntryInfo: OrgToolObject<DockstoreTool>[];
  registryTitle: string;
}

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss', '../../shared/styles/my-entry-sidebar.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatExpansionModule,
    MatTabsModule,
    NgTemplateOutlet,
    MatListModule,
    NgClass,
    ExtendedModule,
    MatIconModule,
    RouterLink,
    RefreshToolOrganizationComponent,
    AsyncPipe,
    KeyValuePipe,
    SelectTabPipe,
  ],
})
export class SidebarAccordionComponent implements OnInit, OnChanges {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgToolObject<DockstoreTool>[];
  @Input() refreshMessage;
  public toolId$: Observable<number>;
  appToolId$: Observable<number>;
  public registryToTools: Map<string, GroupEntriesByRegistry> = new Map<string, GroupEntriesByRegistry>();
  activeTab = 0;

  constructor(private toolQuery: ToolQuery, private workflowQuery: WorkflowQuery, private metadataService: MetadataService) {
    this.metadataService.getDockerRegistries().subscribe((map) => {
      map.forEach((registry) => {
        // Do not create new keys for amazon and seven bridges, to be put in additional category
        if (registry.dockerPath !== null && registry.dockerPath !== 'public.ecr.aws' && registry._enum !== 'SEVEN_BRIDGES')
          this.registryToTools.set(registry.dockerPath, { groupEntryInfo: [], registryTitle: registry.friendlyName.toUpperCase() });
      });
      // For additional tools, to be removed once amazon and seven bridges have their own groupings
      this.registryToTools.set('additional', { groupEntryInfo: [], registryTitle: 'ADDITIONAL' });
      this.sortByRegistries();
    });
  }

  /**
   * Display in original ordering when iterating through keys
   */
  public defaultOrdering(_left: KeyValue<string, GroupEntriesByRegistry>, _right: KeyValue<string, GroupEntriesByRegistry>): number {
    return 0;
  }

  /**
   * Sort tools by registries to display by groups
   */
  public sortByRegistries() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      if (this.registryToTools.has(groupEntryObject.registry)) {
        this.registryToTools.get(groupEntryObject.registry).groupEntryInfo.push(groupEntryObject);
      } else if (this.registryToTools.has('additional')) {
        this.registryToTools.get('additional').groupEntryInfo.push(groupEntryObject);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (const key of this.registryToTools.keys()) {
        this.registryToTools.get(key).groupEntryInfo = [];
      }
      this.sortByRegistries();
    }
  }

  ngOnInit() {
    this.toolId$ = this.toolQuery.toolId$;
    this.appToolId$ = this.workflowQuery.workflowId$;
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DockstoreTool } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { ToolQuery } from '../../shared/tool/tool.query';
import { OrgToolObject } from '../my-tool/my-tool.component';
import { KeyValue } from '@angular/common';
import { MetadataService } from '../../shared/swagger/api/metadata.service';

interface GroupEntriesByRegistry {
  groupEntryInfo: OrgToolObject<DockstoreTool>[];
  registryTitle: string;
}

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss', '../../shared/styles/my-entry-sidebar.scss'],
})
export class SidebarAccordionComponent implements OnInit, OnChanges {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgToolObject<DockstoreTool>[];
  @Input() refreshMessage;
  public toolId$: Observable<number>;
  private dockerRegistryMap = [];
  public registryToTools: Map<string, GroupEntriesByRegistry> = new Map<string, GroupEntriesByRegistry>([]);
  activeTab = 0;

  constructor(private toolQuery: ToolQuery, private metadataService: MetadataService) {
    this.metadataService.getDockerRegistries().subscribe((map) => {
      this.dockerRegistryMap = map;
      this.dockerRegistryMap.forEach((registry) => {
        // Do not create new keys for amazon and seven bridges, to be put in additional category
        if (registry.dockerPath !== null && registry.dockerPath !== 'public.ecr.aws')
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
  public defaultOrdering(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return 0;
  }

  /**
   * Sort tools by registries to display by groups
   */
  public sortByRegistries() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      if (this.registryToTools.has(groupEntryObject.registry)) {
        this.registryToTools.get(groupEntryObject.registry).groupEntryInfo.push(groupEntryObject);
      } else {
        this.registryToTools.get('additional').groupEntryInfo.push(groupEntryObject);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (let key of this.registryToTools.keys()) {
        this.registryToTools.get(key).groupEntryInfo = [];
      }
      this.sortByRegistries();
    }
  }

  ngOnInit() {
    this.toolId$ = this.toolQuery.toolId$;
  }
}

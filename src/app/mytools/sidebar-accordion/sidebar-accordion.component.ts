import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DockstoreTool } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { ToolQuery } from '../../shared/tool/tool.query';
import { OrgToolObject } from '../my-tool/my-tool.component';

interface groupEntriesBySource {
  groupEntryInfo: OrgToolObject<DockstoreTool>[];
  sourceControlTitle: string;
}

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss'],
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgToolObject<DockstoreTool>[];
  @Input() refreshMessage;
  public toolId$: Observable<number>;
  activeTab = 0;

  public registryToTools: Map<string, groupEntriesBySource> = new Map<string, groupEntriesBySource>([
    ['quay.io', { groupEntryInfo: [], sourceControlTitle: 'QUAY.IO' }],
    ['registry.gitlab.com', { groupEntryInfo: [], sourceControlTitle: 'GITLAB.COM' }],
    ['github.com', { groupEntryInfo: [], sourceControlTitle: 'GITHUB.COM' }],
    ['dockstore.org', { groupEntryInfo: [], sourceControlTitle: 'DOCKSTORE.ORG' }],
    ['registry.hub.docker.com', { groupEntryInfo: [], sourceControlTitle: 'HUB.DOCKER.COM' }],
    // For additional tools, to be removed once amazon and seven bridges have their own groupings
    ['additional', { groupEntryInfo: [], sourceControlTitle: 'ADDITIONAL' }],
    // Amazon and seven bridges commented out for now, to be included at a later time
    // ["", { groupEntryInfo: [], sourceControlTitle: 'AMAZONECR'} ],
    // ["", { groupEntryInfo: [], sourceControlTitle: 'SEVENBRIDGES'} ],
  ]);

  constructor(private toolQuery: ToolQuery) {}

  /**
   * Sort tools by registries to display by groups
   */
  public sortByRegistries() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      if (this.registryToTools.has(groupEntryObject.registry)) {
        this.registryToTools.get(groupEntryObject.registry).groupEntryInfo.push(groupEntryObject);
      } else {
        // If a tool doesn't belong to any of the specified keys then add to additional group
        // For additional tools, remove once amazon and seven bridges have their own groups
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

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

  public sortedTools: groupEntriesBySource[] = [
    {
      groupEntryInfo: [],
      sourceControlTitle: 'QUAY.IO',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'GITLAB.COM',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'GITHUB.COM',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'DOCKSTORE.ORG',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'HUB.DOCKER.COM',
    },
    {
      // For additional tools, to be removed once amazon and seven bridges have their own groupings
      groupEntryInfo: [],
      sourceControlTitle: 'ADDITIONAL',
    },
    // Amazon and seven bridges commented out for now, to be included at a later time
    // {
    //   groupEntryInfo: [],
    //   sourceControlTitle: "AMAZONECR",
    // },
    // {
    //   groupEntryInfo: [],
    //   sourceControlTitle: "SEVENBRIDGES",
    // }
  ];

  constructor(private toolQuery: ToolQuery) {}

  /**
   * Sort tools by Registries to display by groups
   */
  public sortByRegistries() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      if (groupEntryObject.registry === 'quay.io') {
        this.sortedTools[0].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.registry === 'registry.gitlab.com') {
        this.sortedTools[1].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.registry === 'github.com') {
        this.sortedTools[2].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.registry === 'dockstore.org') {
        this.sortedTools[3].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.registry === 'registry.hub.docker.com') {
        this.sortedTools[4].groupEntryInfo.push(groupEntryObject);
      } else {
        // For additional tools, remove once amazon and seven bridges have their own groups
        this.sortedTools[5].groupEntryInfo.push(groupEntryObject);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (var index in this.sortedTools) {
        this.sortedTools[index].groupEntryInfo = [];
      }
      this.sortByRegistries();
    }
  }

  ngOnInit() {
    this.toolId$ = this.toolQuery.toolId$;
  }
}

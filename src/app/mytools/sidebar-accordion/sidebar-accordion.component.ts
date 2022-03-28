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
      // For attitional tools, to be removed once amazon and seven bridges have their own groupings
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
   * Sort tools by registeries to display by groups
   */
  public sortByRegisteries() {
    for (var index in this.groupEntriesObject) {
      if (this.groupEntriesObject[index].registry === 'quay.io') {
        this.sortedTools[0].groupEntryInfo.push(this.groupEntriesObject[index]);
      } else if (this.groupEntriesObject[index].registry === 'registry.gitlab.com') {
        this.sortedTools[1].groupEntryInfo.push(this.groupEntriesObject[index]);
      } else if (this.groupEntriesObject[index].registry === 'github.com') {
        this.sortedTools[2].groupEntryInfo.push(this.groupEntriesObject[index]);
      } else if (this.groupEntriesObject[index].registry === 'dockstore.org') {
        this.sortedTools[3].groupEntryInfo.push(this.groupEntriesObject[index]);
      } else if (this.groupEntriesObject[index].registry === 'registry.hub.docker.com') {
        this.sortedTools[4].groupEntryInfo.push(this.groupEntriesObject[index]);
      } else {
        // For additional tools, remove once amazon and seven bridges have their own groups
        this.sortedTools[5].groupEntryInfo.push(this.groupEntriesObject[index]);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (var index in this.sortedTools) {
        this.sortedTools[index].groupEntryInfo = [];
      }
      this.sortByRegisteries();
    }
  }

  ngOnInit() {
    this.toolId$ = this.toolQuery.toolId$;
  }
}

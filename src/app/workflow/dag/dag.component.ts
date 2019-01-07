/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the 'License');
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an 'AS IS' BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { filterNil } from '@datorama/akita';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ga4ghWorkflowIdPrefix } from '../../shared/constants';

import { Dockstore } from '../../shared/dockstore.model';
import { Files } from '../../shared/files';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { ToolDescriptor } from '../../shared/swagger';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { DagQuery } from './state/dag.query';
import { DagService } from './state/dag.service';
import { DagStore } from './state/dag.store';

@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagStore, DagQuery, DagService]
})

// Files class extends EntryTab already, so have DagComponent extend Files
export class DagComponent extends Files implements OnInit, OnChanges {
  @Input() selectedVersion: WorkflowVersion;
  @Input() descriptorType: ToolDescriptor.TypeEnum;

  @ViewChild('exportLink') exportLink: ElementRef;
  @ViewChild('cy') cyElement: ElementRef;

  public dagResult$: Observable<any>;
  private cy: cytoscape.Core;
  public expanded: Boolean = false;
  public workflow$: Observable<Workflow>;
  public isNFL$: Observable<boolean>;
  public isWDL$: Observable<boolean>;
  public descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  public missingTool$: Observable<boolean>;
  public dagType: 'classic' | 'cwlviewer' | 'wdlviewer' = 'classic';
  public enableCwlViewer = Dockstore.FEATURES.enableCwlViewer;
  public enableWdlViewer = Dockstore.FEATURES.enableWdlViewer;
  ToolDescriptor = ToolDescriptor;
  public refreshCounter = 1;

  versionsWithParamfiles: Array<any>;
  previousEntryPath: string;
  previousVersionName: string;

  @HostListener('window:keyup.escape', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.expanded) {
      this.expanded = false;
      this.refreshDocument(this.cy);
    }
  }

  reset() {
    this.refreshCounter++;
    this.refreshDocument(this.cy);
  }

  constructor(private dagService: DagService, private workflowQuery: WorkflowQuery, private dagQuery: DagQuery,
              private paramfilesService: ParamfilesService, private gA4GHFilesService: GA4GHFilesService) {
    super();
  }

  /**
   * For some reason the cy element is not guaranteed to be visible and ready when ngAfterViewinit is called.
   * Using window.requestAnimationFrame() to wait for the element to be visible before subscribing to dagResult$
   * In practice, the wait lasts around 181ms and recursively calls step once
   *
   * @memberof DagComponent
   */
  refreshDocument(cy: cytoscape.Core) {
    const self = this;
    function step() {
      if (self.cyElement) {
        self.cy = self.dagService.refreshDocument(cy, self.cyElement.nativeElement);
      } else {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.refreshDocument(this.cy);
  }

  ngOnInit() {
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
    this.isWDL$ = this.workflowQuery.isWDL$;
    this.dagResult$ = this.dagQuery.dagResults$;
    this.workflow$ = this.workflowQuery.workflow$;
    this.missingTool$ = this.dagQuery.missingTool$;
    this.dagResult$.pipe(filterNil, takeUntil(this.ngUnsubscribe)).subscribe(dagResults => {
      this.refreshDocument(this.cy);
    }, error => console.error('Something went terribly wrong with dagResult$'));
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }

  // TODO: Check how often updateFiles is called on change. This onChange approach might not be reducing the amount of API calls
  ngOnChanges() {
    // Only WDL files should be stored in global store, since they are needed for EPAM pipeline-builder visualization
    if (this.descriptorType === ToolDescriptor.TypeEnum.WDL) {
      this.dagService.getDAGResults(this.selectedVersion, this.id);
      // Retrieve the files for this path from the API, and store in global store on view change
      if (this.previousEntryPath !== this.entrypath || this.previousVersionName !== this.selectedVersion.name) {
        // Only getting files for one descriptor type for workflows (subject to change)
        this.gA4GHFilesService.updateFiles(ga4ghWorkflowIdPrefix + this.entrypath, this.selectedVersion.name,
          [this.descriptorType]);
        this.previousEntryPath = this.entrypath;
        this.previousVersionName = this.selectedVersion.name;
      }
      this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
    }
  }

  download() {
    this.dagService.download(this.cy, this.selectedVersion.name, this.exportLink);
  }
}

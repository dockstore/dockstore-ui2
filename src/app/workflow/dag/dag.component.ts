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
import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { filterNil } from '@datorama/akita';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dockstore } from '../../shared/dockstore.model';
import { EntryTab } from '../../shared/entry/entry-tab';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { ToolDescriptor } from '../../shared/swagger';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { DagQuery } from './state/dag.query';
import { DagService } from './state/dag.service';
import { DagStore } from './state/dag.store';
import { WdlViewerService } from './wdl-viewer/state/wdl-viewer.service';
import { WdlViewerComponent } from './wdl-viewer/wdl-viewer.component';

/**
 * This is the DAG tab
 * TODO: Not have a fixed 500px normal sized DAG in case people are using different height screens
 * TODO: Material tooltips to appear in fullscreen mode.
 * The matTooltip DOM is in a seperate div than the fullscreen element's div, that's why it doesn't show
 * TODO: Performance improvements
 * @export
 * @class DagComponent
 * @extends {EntryTab}
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagStore, DagQuery, DagService, WdlViewerService]
})
export class DagComponent extends EntryTab implements OnInit, OnChanges, AfterViewInit {
  @Input() id: number;
  @Input() selectedVersion: WorkflowVersion;

  @ViewChild('exportLink', { static: false }) exportLink: ElementRef;
  @ViewChild('cy', { static: false }) cyElement: ElementRef;
  @ViewChild(WdlViewerComponent, { static: false }) wdlViewer: WdlViewerComponent;
  @ViewChild('dagHolder', { static: true }) dagHolderElement: ElementRef;

  public dagResult$: Observable<any>;
  private cy: cytoscape.Core;
  public expanded: Boolean = false;
  public workflow$: Observable<BioWorkflow>;
  public isNFL$: Observable<boolean>;
  public isWDL$: Observable<boolean>;
  public descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  public missingTool$: Observable<boolean>;
  public dagType: 'classic' | 'cwlviewer' | 'wdlviewer' = 'classic';
  public enableCwlViewer = Dockstore.FEATURES.enableCwlViewer;
  ToolDescriptor = ToolDescriptor;
  public refreshCounter = 1;
  public dagLoading$: Observable<boolean>;
  public wdlViewerResult$: Observable<boolean>;
  public isPublic$: Observable<boolean>;
  /**
   * Listen to when the document enters or exits fullscreen.
   * Refreshes cytoscape because it is not centered.  Set styling based on whether it's fullscreen or not.
   *
   * @param {KeyboardEvent} event
   * @memberof DagComponent
   */
  @HostListener('document:fullscreenchange', ['$event'])
  FSHandler(event: KeyboardEvent) {
    // expanded is used for HTML styling and depends solely on whether the screen is actually fullscreen or not
    this.expanded = this.dagService.isFullScreen();
    this.refreshDocument(this.cy);
  }

  reset() {
    switch (this.dagType) {
      case 'wdlviewer':
        this.wdlViewer.reset();
        break;
      default:
        this.refreshCounter++;
        this.refreshDocument(this.cy);
        break;
    }
  }
  constructor(
    private dagService: DagService,
    private workflowQuery: WorkflowQuery,
    private dagQuery: DagQuery,
    private ngZone: NgZone,
    private sessionQuery: SessionQuery,
    private wdlViewerService: WdlViewerService
  ) {
    super();
  }

  /**
   * For some reason the cy element is not guaranteed to be visible and ready when ngAfterViewinit is called.
   * Was using window.requestAnimationFrame() before, but now using https://github.com/angular/angular/issues/8804 for performance
   * Still could use more performance optimizations
   *
   * @memberof DagComponent
   */
  refreshDocument(cy: cytoscape.Core) {
    if (this.cyElement && this.cyElement.nativeElement.offsetHeight >= 500) {
      this.ngZone.runOutsideAngular(() =>
        requestAnimationFrame(() => {
          this.cy = this.dagService.refreshDocument(cy, this.cyElement.nativeElement);
        })
      );
    } else {
      requestAnimationFrame(() => this.refreshDocument(cy));
    }
  }

  toggleExpand() {
    if (this.expanded) {
      this.dagService.closeFullscreen();
    } else {
      const nativeElement: HTMLElement | any = this.dagHolderElement.nativeElement;
      this.dagService.openFullscreen(nativeElement);
    }
  }

  ngOnInit() {
    this.dagLoading$ = this.dagQuery.selectLoading();
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
    this.isWDL$ = this.workflowQuery.isWDL$;
    this.dagResult$ = this.dagQuery.dagResults$;
    this.workflow$ = <Observable<BioWorkflow>>this.workflowQuery.workflow$;
    this.missingTool$ = this.dagQuery.missingTool$;
    this.dagService.loadExtensions();
    this.wdlViewerResult$ = this.wdlViewerService.status$;
    this.isPublic$ = this.sessionQuery.isPublic$;
  }

  ngAfterViewInit(): void {
    this.dagResult$
      .pipe(
        filterNil,
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        dagResults => {
          this.refreshDocument(this.cy);
        },
        error => console.error('Something went terribly wrong with dagResult$')
      );
  }

  ngOnChanges() {
    this.wdlViewerService.setStatus(false);
    this.dagService.getDAGResults(this.selectedVersion, this.id);
  }

  download() {
    switch (this.dagType) {
      case 'wdlviewer':
        this.wdlViewer.download(this.exportLink);
        break;
      default:
        this.dagService.download(this.cy, this.selectedVersion.name, this.exportLink);
        break;
    }
  }
}

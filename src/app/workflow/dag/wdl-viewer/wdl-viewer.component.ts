/*
 *    Copyright 2018 OICR
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

import { OnInit, AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import * as pipeline from 'pipeline-builder';
import { Subject, combineLatest, Observable } from 'rxjs';
import { finalize, take, takeUntil, map } from 'rxjs/operators';
import { FileService } from '../../../shared/file.service';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from '../../../shared/state/workflow.query';
import { ToolDescriptor, Workflow, WorkflowsService, WorkflowVersion } from '../../../shared/swagger';
import { DagQuery } from '../state/dag.query';
import { WdlViewerPipeline, WdlViewerService } from './wdl-viewer.service';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: ['./wdl-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WdlViewerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() workflow: Workflow;
  @Input() expanded: boolean;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }
  @ViewChild('diagram') diagram: ElementRef;

  public errorMessage;
  public wdlViewerError = false;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private version: WorkflowVersion;
  private versionChanged = false;
  private visualizer: any;
  private wdlViewerResult$: Observable<boolean>;

  constructor(private wdlViewerService: WdlViewerService, public fileService: FileService, protected gA4GHFilesService: GA4GHFilesService,
    protected workflowsService: WorkflowsService, private renderer: Renderer2, private workflowQuery: WorkflowQuery,
    private dagQuery: DagQuery) {
  }

  ngOnInit() {
    this.wdlViewerResult$ = this.wdlViewerService.status$;
  }

  ngAfterViewInit() {
    this.visualizer = new pipeline.Visualizer(this.diagram.nativeElement, false);

    // Retrieve all files for this workflow from Ga4ghFiles entity Store
    combineLatest(this.wdlViewerService.getFiles(ToolDescriptor.TypeEnum.WDL), this.dagQuery.wdlViewerResults$)
      .pipe(
        map(([files, obj]) => [files, obj]),
        takeUntil(this.ngUnsubscribe),
      ).subscribe(([files, obj]) => {
        // Do not re-create the WDL visualization if the workflow version is not different
        if (!this.versionChanged) {
          return;
        }

        // If previously cached this visualization, attach to DOM
        // TODO: Convert store to EntityStore such that each different workflow version has it's result cached
        if (obj) {
          this.visualizer.attachTo(obj.model[0]);
          this.versionChanged = false;
          this.wdlViewerService.setStatus(true);
          return;
        }

        if (files && files.length > 0) {
          // Create the Epam WDL visualization and attach the result to the DOM element. Stop subscribing after first completion
          this.wdlViewerService.create(files, this.workflow, this.version).pipe(take(1), finalize(() => {
            this.versionChanged = false;
          }))
            .subscribe((res: WdlViewerPipeline) => {
              this.visualizer.attachTo(res.model[0]);
              this.wdlViewerError = false;
              this.wdlViewerService.setStatus(true);
              this.wdlViewerService.setWdlViewerPipeline(res);
            },
              (error) => {
                this.errorMessage = error || 'Unknown Error';
                this.wdlViewerError = true;
                this.diagram.nativeElement.remove();
                this.wdlViewerService.setStatus(false);
              });
        } else {
          this.wdlViewerService.setStatus(false);
          this.wdlViewerError = true;
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onVersionChange(value: WorkflowVersion) {
    // Reset all booleans types for the new version
    this.wdlViewerError = false;

    if (this.visualizer) {
      this.visualizer.clear();
    }
    this.version = value;
    this.versionChanged = true;
  }

  reset() {
    this.visualizer.zoom.fitToPage();
  }

  download(exportLink: ElementRef) {
    const blob = new Blob([this.visualizer.paper.getSVG()], { type: 'text/plain;charset=utf-8' });
    const name = this.workflowQuery.getActive().repository + '_' + this.version.name + '.svg';
    this.renderer.setAttribute(exportLink.nativeElement, 'href', URL.createObjectURL(blob));
    this.renderer.setAttribute(exportLink.nativeElement, 'download', name);
  }
}

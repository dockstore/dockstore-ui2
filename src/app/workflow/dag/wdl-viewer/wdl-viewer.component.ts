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

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import * as pipeline from 'pipeline-builder';
import { Subject } from 'rxjs';
import { take, takeUntil, delay } from 'rxjs/operators';
import { FileService } from '../../../shared/file.service';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from '../../../shared/state/workflow.query';
import { ToolDescriptor, Workflow, WorkflowsService, WorkflowVersion } from '../../../shared/swagger';
import { WdlViewerPipelineResponse } from './state/wdl-viewer.model';
import { WdlViewerQuery } from './state/wdl-viewer.query';
import { WdlViewerService } from './state/wdl-viewer.service';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: ['./wdl-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WdlViewerComponent implements AfterViewInit, OnDestroy {
  @Input() workflow: Workflow;
  @Input() expanded: boolean;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.loading = true;
    this.onVersionChange(value);
  }
  @ViewChild('diagram') diagram: ElementRef;

  public errorMessage;
  public loading = true;
  public wdlViewerError = false;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private version: WorkflowVersion;
  private versionChanged = false;
  private visualizer: any;

  constructor(
    private wdlViewerService: WdlViewerService,
    public fileService: FileService,
    protected gA4GHFilesService: GA4GHFilesService,
    protected workflowsService: WorkflowsService,
    private renderer: Renderer2,
    private workflowQuery: WorkflowQuery,
    private wdlViewerQuery: WdlViewerQuery
  ) {}

  ngAfterViewInit() {
    this.visualizer = new pipeline.Visualizer(this.diagram.nativeElement, false);

    // Retrieve all files for this workflow from Ga4ghFiles entity Store
    this.wdlViewerService
      .getFiles(ToolDescriptor.TypeEnum.WDL)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(files => {
        // Do not re-create the WDL visualization if the workflow version is not different
        if (!this.versionChanged) {
          return;
        }

        // Add delay so parent component can finish rendering its view before the status is set
        this.wdlViewerQuery
          .selectEntity(this.version.id)
          .pipe(
            delay(0),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((wdlViewerPipelineResponse: WdlViewerPipelineResponse) => {
            this.wdlViewerError = false;

            if (wdlViewerPipelineResponse) {
              // Attach cached pipeline to the DOM element
              this.visualizer.attachTo(wdlViewerPipelineResponse.model[0]);
              this.clearProgressBar();
              this.wdlViewerService.setStatus(true);
            } else if (files && files.length > 0 && this.version.id) {
              // Create the Epam WDL visualization and attach the result to the DOM element. Stop subscribing after first completion
              this.wdlViewerService
                .create(files, this.workflow, this.version)
                .pipe(take(1))
                .subscribe(
                  (res: WdlViewerPipelineResponse) => {
                    this.wdlViewerService.update(this.workflow.id, this.version.id, res);
                  },
                  (error: Error) => {
                    this.showError(error);
                  }
                );
            } else {
              this.showError();
            }
          });
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

    // Reset the store on every workflow change
    if (this.workflow.id !== this.wdlViewerQuery.getActiveId()) {
      this.wdlViewerService.removeAll();
    }
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

  private clearProgressBar() {
    this.loading = false;
    this.versionChanged = false;
  }

  private showError(error?: Error) {
    this.errorMessage = error || 'Unknown Error';
    this.clearProgressBar();
    this.wdlViewerError = true;
    this.diagram.nativeElement.remove();
    this.wdlViewerService.setStatus(false);
  }
}

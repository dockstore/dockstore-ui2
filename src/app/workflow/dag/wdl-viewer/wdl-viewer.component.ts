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

import { AfterViewInit, Component, Input, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import * as pipeline from 'pipeline-builder';

import { Observable, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { FileService } from '../../../shared/file.service';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { ToolDescriptor, ToolFile, WorkflowsService, WorkflowVersion } from '../../../shared/swagger';
import { WdlViewerService } from './wdl-viewer.service';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: ['./wdl-viewer.component.scss'],
  providers: [WdlViewerService],
  encapsulation: ViewEncapsulation.None,
})
export class WdlViewerComponent implements AfterViewInit, OnDestroy {

  @Input() workflow: ExtendedWorkflow;
  @Input() expanded: boolean;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.loading = true;
    this.onVersionChange(value);
  }
  @ViewChild('diagram') diagram: ElementRef;
  @ViewChild('exportSVG') exportSVG: ElementRef;

  public pipelineBuilderResult$: Observable<any>;
  public errorMessage;
  public loading = false;
  public wdlViewerError = false;
  protected files: Array<ToolFile>;
  protected entryType: ('tool' | 'workflow') = 'workflow';
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private version: WorkflowVersion;
  private visualizer: any;

  constructor(private wdlViewerService: WdlViewerService, public fileService: FileService, protected gA4GHFilesService: GA4GHFilesService,
              protected workflowsService: WorkflowsService) {
  }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    this.visualizer = new pipeline.Visualizer(this.diagram.nativeElement, false);

    // Retrieve all files for this workflow from Ga4ghFiles entity Store
    this.wdlViewerService.getFiles(ToolDescriptor.TypeEnum.WDL).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(files => {
        if (files.length > 0) {
          this.pipelineBuilderResult$ = this.wdlViewerService.create(files, this.workflow, this.version);

          // Create the Epam pipeline builder visualization and attach the result to the DOM element
          this.pipelineBuilderResult$.pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading = false))
            .subscribe((pipeline: any) => {
                this.visualizer.attachTo(pipeline.model[0]);
                this.wdlViewerError = false;
              },
              (error) => {
                this.errorMessage = error || 'Unknown Error';
                this.wdlViewerError = true;
                this.diagram.nativeElement.remove();
              });
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onVersionChange(value) {
    this.version = value;
  }

  reset() {
    this.wdlViewerService.reset(this.visualizer);
  }

  download() {
    this.wdlViewerService.download(this.visualizer, this.version.name, this.exportSVG);
  }
}

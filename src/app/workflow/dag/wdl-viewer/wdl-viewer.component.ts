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
import { filterNil } from '@datorama/akita';
import * as JSZip from 'jszip';
import * as pipeline from 'pipeline-builder';

import { Observable, from, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { DescriptorService } from '../../../shared/descriptor.service';
import { FileService } from '../../../shared/file.service';
import { GA4GHFilesQuery } from '../../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { ToolDescriptor, ToolFile, WorkflowsService, SourceFile, WorkflowVersion } from '../../../shared/swagger';
import { WdlViewerService } from './wdl-viewer.service';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: [
    './wdl-viewer.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class WdlViewerComponent extends WdlViewerService implements AfterViewInit, OnDestroy {
  private zip: JSZip = new JSZip();

  @Input() workflow: ExtendedWorkflow;
  @Input() expanded: boolean;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }

  @ViewChild('diagram') diagram: ElementRef;

  public pipelineBuilderResult$: Observable<any>;
  public errorMessage;
  public loading = false;
  public wdlViewerError = false;


  protected entryType: ('tool' | 'workflow') = 'workflow';

  private visualizer: any;

  constructor(public fileService: FileService, private descriptorsService: DescriptorService,
    private gA4GHFilesQuery: GA4GHFilesQuery, protected gA4GHFilesService: GA4GHFilesService, protected workflowsService: WorkflowsService ) {
    super(fileService, gA4GHFilesService, workflowsService);
  }

  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }

  getDescriptors(version): Array<ToolDescriptor.TypeEnum> {
    return this.descriptorsService.getDescriptors(this._selectedVersion);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    this.visualizer = new pipeline.Visualizer(this.diagram.nativeElement, false);

    // Retrieve all files for this workflow from Ga4ghFiles entity Store
    this.getFiles(ToolDescriptor.TypeEnum.WDL).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(files => {
        this.files = files;

        if (this.files.length > 1) {
          console.log('Multi-file wdl');
          this.createMultiFileVisualization();
        } else {
          this.createSingleFileVisualization();
        }
      });
  }

  /**
   * Creates EPAM pipeline builder visualization for WDL files without imports
   */
  createSingleFileVisualization(): void {
    this.workflowsService.wdl(this.workflow.id, this._selectedVersion.name).subscribe((primaryFile: SourceFile) => {

      // When the primary file is available and if there should only be one type of file
      if (primaryFile && this.files.length == 1) {
        this.pipelineBuilderResult$ = from(pipeline.parse(primaryFile.content));

        // If the visualization was successfully generated, attach to DOM element
        this.pipelineBuilderResult$.pipe(filterNil, takeUntil(this.ngUnsubscribe), finalize(() => this.loading = false))
          .subscribe((pipeline) => {
              if (pipeline.model[0]) {
                this.visualizer.attachTo(pipeline.model[0]);
                this.wdlViewerError = false;
              }
            },
            (error) => {
              this.errorMessage = error || 'Unknown error';
              this.wdlViewerError = true;
              this.diagram.nativeElement.remove();    // Remove the div element from the DOM, to remove empty div
            });
      }
    });

  }

  /**
   * Creates EPAM pipeline builder visualization for WDL files with imports
   * TODO: SVGs can’t scale rectangles, etc. properly for a div using [hidden] i.e. display: none. The alternative is to generate the SVG each time the radio button is selected, which is too costly
   */
  createMultiFileVisualization(): void {

    // Retrieve primary and secondary files from WDL workflow API endpoints
    forkJoin(this.workflowsService.wdl(this.workflow.id, this._selectedVersion.name), this.workflowsService.secondaryWdl(this.workflow.id, this._selectedVersion.name))
      .subscribe(results => {

        const primaryFile = results[0];
        const secondaryFiles = results[1];

        // Load each secondary file into the zip file object
        secondaryFiles.forEach(file => this.zip.file(file.path, file.content));

        this.zip.generateAsync({type: 'blob'}).then(zipFile => {

          // When both the primary file and zip object with secondary files are available
          if (primaryFile && zipFile) {
            this.pipelineBuilderResult$ = from(pipeline.parse(primaryFile.content, {zipFile: zipFile}));

            // If the visualization was successfully generated, attach to DOM element
            this.pipelineBuilderResult$.pipe(filterNil, takeUntil(this.ngUnsubscribe), finalize(() => this.loading = false))
              .subscribe((pipeline) => {
                  if (pipeline.model[0]) {
                    this.visualizer.attachTo(pipeline.model[0]);
                    this.wdlViewerError = false;
                  }
                },
                (error) => {
                  this.errorMessage = error || 'Unknown error';
                  this.wdlViewerError = true;
                  this.diagram.nativeElement.remove();    // Remove the div element from the DOM, to remove empty div
                });
          }
        });
      });
  }

  reset() {
    this.visualizer.zoom.fitToPage();
  }
}

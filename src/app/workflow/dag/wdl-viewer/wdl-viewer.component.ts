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

import { AfterViewInit, Component, Input, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import * as JSZip from 'jszip';
import * as pipeline from 'pipeline-builder';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ga4ghWorkflowIdPrefix } from '../../../shared/constants';
import { DescriptorService } from '../../../shared/descriptor.service';
import { FileService } from '../../../shared/file.service';
import { GA4GHFilesQuery } from '../../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { GA4GHService, ToolDescriptor, ToolFile } from '../../../shared/swagger';
import { WorkflowVersion } from '../../../shared/swagger';
import { FilesQuery } from '../../files/state/files.query';
import { FilesService } from '../../files/state/files.service';
import { WdlViewerService } from './wdl-viewer.service';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: [
    './wdl-viewer.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class WdlViewerComponent extends WdlViewerService implements OnChanges, AfterViewInit, OnDestroy {
  private zip: JSZip = new JSZip();

  @Input() workflow: ExtendedWorkflow;
  @Input() expanded: boolean;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }


  previousEntryPath: string;
  previousVersionName: string;

  protected entryType: ('tool' | 'workflow') = 'workflow';

  constructor(public fileService: FileService, private descriptorsService: DescriptorService,
    private gA4GHFilesQuery: GA4GHFilesQuery, protected gA4GHFilesService: GA4GHFilesService, protected gA4GHService: GA4GHService,
    protected filesService: FilesService, protected filesQuery: FilesQuery) {
    super(fileService, gA4GHFilesService, gA4GHService, filesService, filesQuery);
  }

  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }

  getDescriptors(version): Array<ToolDescriptor.TypeEnum> {
    return this.descriptorsService.getDescriptors(this._selectedVersion);
  }

  // TODO: Check how often updateFiles is called on change. This onChange approach might not be reducing the amount of API calls
  ngOnChanges() {
    // Retrieve the files for this path from the API, and store in global store on view change
    if (this.previousEntryPath !== this.workflow.full_workflow_path || this.previousVersionName !== this._selectedVersion.name) {
      // Only getting files for one descriptor type for workflows (subject to change)
      this.gA4GHFilesService.updateFiles(ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path, this._selectedVersion.name,
        [this.descriptorType]);
      this.previousEntryPath = this.workflow.full_workflow_path;
      this.previousVersionName = this._selectedVersion.name;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    // Retrieve all files for this workflow from Ga4ghFiles entity Store
    this.getFiles(ToolDescriptor.TypeEnum.WDL).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(files => {
        this.files = files;

        if (this.files.length > 1) {
          console.log('Multi-file wdl');
          this.createMultiFileVisualization(this.files);
        } else {
          this.createSingleFileVisualization(this.files);
        }
      })
  }

  /**
   * Creates EPAM pipeline builder visualization for WDL files without imports
   * @param descriptorFiles
   */
  createSingleFileVisualization(descriptorFiles: any[]): void {
    const primaryFile = descriptorFiles.filter(file => file.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR);

    if (primaryFile[0]) {
      // Store primary file into Files Store, if it does not already exist
      this.storeFileDescriptor(primaryFile[0]);

      this.filesQuery.getFileEntities(primaryFile).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(primary => {
          const diagram = new pipeline.Visualizer(document.getElementById('diagram'));

          if (primary[0]) {
            pipeline.parse(primary[0].content).then((res) => {
              let flow = res.model[0];
              diagram.attachTo(flow);
            }).catch((message) => {
              console.log(message);
            });
          }
        });
    }
  }

  /**
   * Creates EPAM pipeline builder visualization for WDL files with imports
   * @param descriptorFiles
   */
  createMultiFileVisualization(descriptorFiles: ToolFile[]): void {
    const primaryFile = descriptorFiles.filter(file => file.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR);
    const secondaryFiles = descriptorFiles.filter(file => file.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR);

    // Store each primary/secondary file into Files Store, if they does not already exist
    descriptorFiles.forEach(file => {
      if (primaryFile.indexOf(file) != -1 || secondaryFiles.indexOf(file) != -1) {
        this.storeFileDescriptor(file);
      }
    });

    // Retrieve secondary files and zip them together
    this.filesQuery.getFileEntities(secondaryFiles).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(fileEntities => {

        // Load each secondary file into the jszip object
        fileEntities.forEach(file => this.zip.file(file.url.split('/').pop(), file.content));

        // Retrieve primary file
        this.filesQuery.getFileEntities(primaryFile).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(primary => {

            if (primary[0]) {
              // Generate the secondary files zip object as Blob object
              this.zip.generateAsync({type: 'blob'}).then(content => {
                const diagram = new pipeline.Visualizer(document.getElementById('diagram'));

                if (content) {
                  pipeline.parse(primary[0].content, { zipFile: content }).then((res) => {
                    let flow = res.model[0];
                    diagram.attachTo(flow);
                  }).catch((message) => {
                    console.log(message);
                  });
                }
              });
            }
          });
      });
  }
}

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

import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import * as JSZip from 'jszip';
import * as pipeline from 'pipeline-builder';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ga4ghWorkflowIdPrefix } from '../../../shared/constants';
import { GA4GHFiles } from '../../../shared/ga4gh-files/ga4gh-files.model';
import { GA4GHFilesQuery } from '../../../shared/ga4gh-files/ga4gh-files.query';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { FileWrapper, GA4GHService, ToolDescriptor, ToolFile } from '../../../shared/swagger/index';
import { WorkflowVersion } from '../../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-wdl-viewer',
  templateUrl: './wdl-viewer.html',
  styleUrls: [
    './wdl-viewer.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class WdlViewerComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private files: Array<ToolFile>;
  private ngUnsubscribe: Subject<{}> = new Subject();
  private primaryFile: ToolFile;
  private zipFile: JSZip = new JSZip();

  @Input() workflow: ExtendedWorkflow;
  @Input() selectedVersion: WorkflowVersion;
  @Input() expanded: boolean;


  constructor(private gA4GHFilesQuery: GA4GHFilesQuery, protected gA4GHService: GA4GHService) {
  }

  private getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log("wdl-viewer onchanges");
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {

    // Retrieve the files stored inside the Akita global storage (initialized by dag.component)
    this.getFiles('WDL').pipe(takeUntil(this.ngUnsubscribe))
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
   * Creates EPAM pipeline builder visualization for wdl files without imports
   * @param files
   */
  createSingleFileVisualization(files: any[]): void {
    this.primaryFile = files.filter(file => file.file_type === "PRIMARY_DESCRIPTOR")[0];

    if (this.primaryFile) {
      // Retrieve content of primary file
      this.gA4GHService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(this.workflow.descriptorType, ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path,
        this.selectedVersion.name, this.primaryFile.path).subscribe((file: FileWrapper) => {

        const diagram = new pipeline.Visualizer(document.getElementById('diagram'));

        pipeline.parse(file.content).then((res) => {
          let flow = res.model[0];
          diagram.attachTo(flow);
        }).catch((message) => {
          throw new Error(message);
        });

        // console.log(this.workflow);

      });
    }
  }


  createMultiFileVisualization(files: any[]): void {
    let secondaryFiles = files.filter(file => file.file_type === "SECONDARY_DESCRIPTOR");
    console.log(secondaryFiles);

    // For each secondary file, attempt to place into the global store if it does not already exist
    secondaryFiles.forEach(file => {
    })
  }
}

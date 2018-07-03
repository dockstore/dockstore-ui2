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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CwlViewerDescriptor, CwlViewerService } from './cwl-viewer.service';
import { WorkflowVersion } from '../../../shared/swagger/model/workflowVersion';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cwl-viewer',
  templateUrl: './cwl-viewer.html',
  providers: [CwlViewerService],
  styleUrls: ['./cwl-viewer.scss']
})

export class CwlViewerComponent implements OnInit, OnDestroy {

  @Input() workflow: ExtendedWorkflow;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this.version = value;
      this.onChange();
    }
  }
  @Input() set refresh(value: any) {
    this.resetZoom();
  }
  @Input() expanded: boolean;

  public cwlViewerError = false;
  public cwlViewerPercentageZoom = 100;
  public cwlViewerDescriptor: CwlViewerDescriptor;
  public errorMessage;
  public loading = false;

  private version;
  private onDestroy$ = new Subject<void>();

  constructor(private cwlViewerService: CwlViewerService) {
  }

  ngOnInit(): void {
    this.cwlViewerDescriptor = null;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  resetZoom() {
    this.cwlViewerPercentageZoom = 100;
  }

  onChange() {
    if (this.version) {
      this.loading = true;
      this.cwlViewerDescriptor = null;
      this.errorMessage = null;
      this.cwlViewerService.getVisualizationUrls(this.workflow.providerUrl, this.version.reference,
        this.version.workflow_path, this.onDestroy$)
        .subscribe(
          cwlViewerDescriptor => {
            this.cwlViewerDescriptor = cwlViewerDescriptor;
            this.cwlViewerError = false;
            this.loading = false;
            this.resetZoom();
          },
          (error) => {
            this.errorMessage = error.message || 'Unknown error';
            this.cwlViewerDescriptor = null;
            this.cwlViewerError = true;
            this.loading = false;
          });
    }
  }

  onWheel(event: WheelEvent) {
    const offset = event.deltaY > 0 ? -10 : 10;
    const newWidth = this.cwlViewerPercentageZoom + offset;
    if (newWidth >= 1) {
      this.cwlViewerPercentageZoom = newWidth;
    }
    event.preventDefault();
  }

}

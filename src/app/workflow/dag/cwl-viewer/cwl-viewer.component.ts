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

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { ExtendedWorkflowQuery } from '../../../shared/state/extended-workflow.query';
import { WorkflowVersion } from '../../../shared/swagger/model/workflowVersion';
import { CwlViewerDescriptor, CwlViewerService } from './cwl-viewer.service';

@Component({
  selector: 'app-cwl-viewer',
  templateUrl: './cwl-viewer.html',
  providers: [CwlViewerService],
  styleUrls: ['./cwl-viewer.scss']
})
export class CwlViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedVersion: WorkflowVersion;
  @Input() set refresh(value: any) {
    this.resetZoom();
  }
  @Input() expanded: boolean;

  public cwlViewerError = false;
  public cwlViewerPercentageZoom = 100;
  public cwlViewerDescriptor: CwlViewerDescriptor;
  public errorMessage;
  public loading = false;
  public extendedWorkflow: ExtendedWorkflow;

  private onDestroy$ = new Subject<void>();

  constructor(private cwlViewerService: CwlViewerService, private extendedWorkflowQuery: ExtendedWorkflowQuery) {}

  ngOnInit(): void {
    this.cwlViewerDescriptor = null;
    this.extendedWorkflowQuery.extendedWorkflow$.pipe(takeUntil(this.onDestroy$)).subscribe(workflow => {
      this.extendedWorkflow = workflow;
      this.updateCwlViewerImg();
    });
  }

  ngOnChanges(): void {
    this.updateCwlViewerImg();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  resetZoom() {
    this.cwlViewerPercentageZoom = 100;
  }

  onWheel(event: WheelEvent) {
    const offset = event.deltaY > 0 ? -10 : 10;
    const newWidth = this.cwlViewerPercentageZoom + offset;
    if (newWidth >= 1) {
      this.cwlViewerPercentageZoom = newWidth;
    }
    event.preventDefault();
  }

  private updateCwlViewerImg() {
    if (this.selectedVersion && this.extendedWorkflow) {
      this.loading = true;
      this.cwlViewerDescriptor = null;
      this.errorMessage = null;
      this.cwlViewerService
        .getVisualizationUrls(
          this.extendedWorkflow.providerUrl,
          this.selectedVersion.reference,
          this.selectedVersion.workflow_path,
          this.onDestroy$
        )
        .subscribe(
          cwlViewerDescriptor => {
            this.cwlViewerDescriptor = cwlViewerDescriptor;
            this.cwlViewerError = false;
            this.loading = false;
            this.resetZoom();
          },
          error => {
            this.errorMessage = error.message || 'Unknown error';
            this.cwlViewerDescriptor = null;
            this.cwlViewerError = true;
            this.loading = false;
          }
        );
    }
  }
}

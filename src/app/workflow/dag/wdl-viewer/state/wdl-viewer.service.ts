/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import * as JSZip from 'jszip';
import * as pipeline from 'pipeline-builder';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators';
import { GA4GHFilesQuery } from '../../../../shared/ga4gh-files/ga4gh-files.query';
import { ExtendedWorkflow } from '../../../../shared/models/ExtendedWorkflow';
import { ToolDescriptor, ToolFile, WorkflowsService, WorkflowVersion } from '../../../../shared/swagger';
import { WdlViewerPipelineResponse } from './wdl-viewer.model';
import { WdlViewerStore } from './wdl-viewer.store';

/**
 * Service for creating WDL workflow visualizations with EPAM Pipeline Builder library
 */
@Injectable({ providedIn: 'root' })
export class WdlViewerService {
  private zip: JSZip = new JSZip();
  private statusSource = new BehaviorSubject<boolean>(false);
  public status$ = this.statusSource.asObservable();
  constructor(
    private gA4GHFilesQuery: GA4GHFilesQuery,
    private workflowsService: WorkflowsService,
    private wdlViewerStore: WdlViewerStore
  ) {}

  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [
      ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR
    ]);
  }

  /**
   * Indicates if parsing the WDL workflow visualization was successful or not
   *
   * @param val
   */
  setStatus(val: boolean): void {
    this.statusSource.next(val);
  }

  /**
   * Driver function for creating workflow visualizations
   *
   * @param files
   * @param workflow
   * @param version
   */
  create(files: Array<ToolFile>, workflow: ExtendedWorkflow, version: WorkflowVersion): Observable<WdlViewerPipelineResponse> {
    if (files.length > 1) {
      return this.createMultiple(workflow, version);
    } else {
      return this.createSingle(workflow, version);
    }
  }

  /**
   * Creates WDL workflow visualization for single-file workflows
   *
   * @param workflow
   * @param version
   */
  createSingle(workflow: ExtendedWorkflow, version: WorkflowVersion): Observable<WdlViewerPipelineResponse> {
    return this.workflowsService.primaryDescriptor(workflow.id, version.name, ToolDescriptor.TypeEnum.WDL).pipe(
      switchMap(prim => {
        // Errors thrown by the parse function are caught by the Observable being subscribed to
        return <Observable<WdlViewerPipelineResponse>>from(pipeline.parse(prim.content));
      })
    );
  }

  /**
   * Creates WDL workflow visualization for multi-file workflows (with import files)
   *
   * @param workflow
   * @param version
   */
  createMultiple(workflow: ExtendedWorkflow, version: WorkflowVersion): Observable<WdlViewerPipelineResponse> {
    return forkJoin([
      this.workflowsService.primaryDescriptor(workflow.id, version.name, ToolDescriptor.TypeEnum.WDL),
      this.workflowsService.secondaryDescriptors(workflow.id, version.name, ToolDescriptor.TypeEnum.WDL)
    ]).pipe(
      switchMap(res => {
        // Store each secondary file in a zip object
        res[1].forEach(file => this.zip.file(file.path, file.content));

        return from(this.zip.generateAsync({ type: 'blob' })).pipe(
          switchMap(zip => {
            // Errors thrown by the parse function are caught by the Observable being subscribed to
            return <Observable<WdlViewerPipelineResponse>>from(pipeline.parse(res[0].content, { zipFile: zip }));
          })
        );
      })
    );
  }

  @transaction()
  update(workflowId: number, versionId: number, result: WdlViewerPipelineResponse) {
    this.wdlViewerStore.upsert(versionId, result);
    this.wdlViewerStore.setActive(workflowId);
  }

  removeAll() {
    this.wdlViewerStore.remove();
  }
}

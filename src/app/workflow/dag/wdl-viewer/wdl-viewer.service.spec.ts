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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { of as observableOf, throwError } from 'rxjs';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { WorkflowVersion, ToolDescriptor } from '../../../shared/swagger';
import { sampleWorkflow1, sampleWorkflow2, sampleWorkflowVersion } from '../../../test/mocked-objects';
import { WdlViewerService } from './state/wdl-viewer.service';

describe('Service: WDLViewer', () => {
  let wdlViewerService: WdlViewerService;

  const singleResponse = {
    pipeline: {
      actions: ['l', 'l', 'f'],
      message: '',
      model: ['f'],
      status: true
    }
  };

  const multipleResponse = {
    pipeline: {
      actions: ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'f'],
      message: '',
      model: ['f'],
      status: true
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WdlViewerService],
      imports: [HttpClientTestingModule]
    });
    wdlViewerService = TestBed.get(WdlViewerService);
  });

  it('should be truthy', inject([WdlViewerService], (service: WdlViewerService) => {
    expect(service).toBeTruthy();
  }));

  it('should create single file workflow visualization', () => {
    let response;
    const workflow: ExtendedWorkflow = sampleWorkflow1;
    const version: WorkflowVersion = sampleWorkflowVersion;

    spyOn(wdlViewerService, 'createSingle').and.returnValue(observableOf(singleResponse));

    wdlViewerService.createSingle(workflow, version).subscribe(
      res => {
        response = res;
      },
      () => {
        fail('expected success');
      }
    );

    expect(response).toEqual(singleResponse);
  });

  it('should create multiple file workflow visualization', () => {
    let response;
    const workflow: ExtendedWorkflow = sampleWorkflow2;
    const version: WorkflowVersion = sampleWorkflowVersion;

    spyOn(wdlViewerService, 'createMultiple').and.returnValue(observableOf(multipleResponse));

    wdlViewerService.createMultiple(workflow, version).subscribe(
      res => {
        response = res;
      },
      () => {
        fail('expected success');
      }
    );

    expect(response).toEqual(multipleResponse);
  });

  it('should handle errors if receiving null/empty when retrieving files from the Files Store', () => {
    const empty = observableOf([]);

    spyOn(wdlViewerService, 'getFiles').and.returnValue(throwError(empty));

    wdlViewerService.getFiles(ToolDescriptor.TypeEnum.WDL).subscribe(
      () => {
        fail('expected error');
      },
      err => {
        expect(err).toEqual(empty);
      }
    );
  });

  it('should handle errors if creating single-file workflow visualization fails', () => {
    const workflow: ExtendedWorkflow = sampleWorkflow2;
    const version: WorkflowVersion = sampleWorkflowVersion;

    const error = {
      Error: 'Message Body'
    };

    spyOn(wdlViewerService, 'createSingle').and.returnValue(throwError(error));

    wdlViewerService.createSingle(workflow, version).subscribe(
      () => {
        fail('expected error');
      },
      err => {
        expect(err).toEqual(error);
      }
    );
  });

  it('should handle errors if creating multiple-file workflow visualization fails', () => {
    const workflow: ExtendedWorkflow = sampleWorkflow2;
    const version: WorkflowVersion = sampleWorkflowVersion;

    const error = {
      Error: 'Message Body'
    };

    spyOn(wdlViewerService, 'createMultiple').and.returnValue(throwError(error));

    wdlViewerService.createMultiple(workflow, version).subscribe(
      () => {
        fail('expected error');
      },
      err => {
        expect(err).toEqual(error);
      }
    );
  });
});

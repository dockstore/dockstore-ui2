import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { Dockstore } from '../../../shared/dockstore.model';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { WorkflowVersion } from '../../../shared/swagger';
import { WdlViewerService } from './wdl-viewer.service';

describe('Service: WDLViewer', () => {
  let wdlViewerService: WdlViewerService;
  let workflow: ExtendedWorkflow;
  let version: WorkflowVersion;

  const singleResponse = {
    'pipeline': {
      'actions': [
        'l',
        'l',
        'f'
      ],
      'message': '',
      'model': [
        'f'
      ],
      'status': true
    }
  };

  const multipleResponse = {
    'pipeline': {
      'actions': [
        'l',
        'l',
        'l',
        'l',
        'l',
        'l',
        'l',
        'f'
      ],
      'message': '',
      'model': [
        'f'
      ],
      'status': true
    }
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ WdlViewerService ],
      imports: [HttpClientTestingModule]
    });
    wdlViewerService = TestBed.get(WdlViewerService);
  });

  it('should be truthy', inject([WdlViewerService], (service: WdlViewerService) => {
    expect(service).toBeTruthy();
  }));

  if (Dockstore.FEATURES.enableWdlViewer) {
    it('should create single file workflow visualization', () => {
      let response;
      spyOn(wdlViewerService, 'createSingle').and.returnValue(of(singleResponse));

      wdlViewerService.createSingle(workflow, version)
        .subscribe((res) => {
            response = res;
          },
          (error) => {
          });

      expect(response).toEqual(singleResponse);
    });
  }

  if (Dockstore.FEATURES.enableWdlViewer) {
    it('should create multiple file workflow visualization', () => {
      let response;
      spyOn(wdlViewerService, 'createMultiple').and.returnValue(of(multipleResponse));

      wdlViewerService.createMultiple(workflow, version)
        .subscribe((res) => {
            response = res;
          },
          (error) => {
          });

      expect(response).toEqual(multipleResponse);
    });
  }
});

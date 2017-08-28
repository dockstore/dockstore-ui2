import { HttpService } from './../../shared/http.service';
import { HttpStubService } from './../../test/service-stubs';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DagService } from './dag.service';

describe('Service: Dag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DagService, {
        provide: HttpService, useClass: HttpStubService
      }]
    });
  });

  it('should ...', inject([DagService], (service: DagService) => {
    expect(service).toBeTruthy();
  }));
});

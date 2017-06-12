/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DagService } from './dag.service';

describe('Service: Dag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DagService]
    });
  });

  it('should ...', inject([DagService], (service: DagService) => {
    expect(service).toBeTruthy();
  }));
});
/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

describe('Service: MyBioWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyBioWorkflowsService]
    });
  });

  it('should ...', inject([MyBioWorkflowsService], (service: MyBioWorkflowsService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { ToolObservableService } from './tool-observable.service';

describe('ToolObservableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToolObservableService]
    });
  });

  it('should ...', inject([ToolObservableService], (service: ToolObservableService) => {
    expect(service).toBeTruthy();
  }));
});

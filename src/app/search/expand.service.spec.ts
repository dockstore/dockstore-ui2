/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExpandService } from './expand.service';

describe('Service: Expand', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpandService]
    });
  });

  it('should ...', inject([ExpandService], (service: ExpandService) => {
    expect(service).toBeTruthy();
  }));
});
import { TestBed, inject } from '@angular/core/testing';

import { PagenumberService } from './pagenumber.service';

describe('PagenumberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagenumberService]
    });
  });

  it('should be created', inject([PagenumberService], (service: PagenumberService) => {
    expect(service).toBeTruthy();
  }));
});

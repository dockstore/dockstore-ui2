import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { PagenumberService } from './pagenumber.service';

describe('PagenumberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagenumberService],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ RouterTestingModule]
    });
  });

  it('should be created', inject([PagenumberService], (service: PagenumberService) => {
    expect(service).toBeTruthy();
  }));
});

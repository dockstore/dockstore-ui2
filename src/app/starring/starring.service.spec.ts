import { TestBed, inject } from '@angular/core/testing';

import { StarringService } from './starring.service';

describe('StarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarringService]
    });
  });

  it('should be created', inject([StarringService], (service: StarringService) => {
    expect(service).toBeTruthy();
  }));
});

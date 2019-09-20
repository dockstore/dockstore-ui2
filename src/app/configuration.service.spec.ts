import { inject, TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from 'ng2-ui-auth';

describe('ConfigurationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService, { provide: ConfigService, useValue: {} }]
    })
  );

  it('should be created', inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});

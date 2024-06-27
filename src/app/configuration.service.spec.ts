import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { ConfigService } from './ng2-ui-auth/public_api';

describe('ConfigurationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService, { provide: ConfigService, useValue: {} }, { provide: Window, useValue: window }],
    })
  );

  it('should be created', inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { ConfigService } from './ng2-ui-auth/public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigurationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ConfigurationService,
        { provide: ConfigService, useValue: {} },
        { provide: Window, useValue: window },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
  );

  it('should be created', inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});

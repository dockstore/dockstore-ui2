import { AuthService } from 'ng2-ui-auth';
import { HttpStubService, AuthStubService } from './../test/service-stubs';
import { HttpService } from './../shared/http.service';
import { TestBed, inject } from '@angular/core/testing';

import { StarringService } from './starring.service';

describe('StarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarringService,
        {provide: HttpService, useClass: HttpStubService},
        {provide: AuthService, useClass: AuthStubService}
      ]
    });
  });

  it('should be created', inject([StarringService], (service: StarringService) => {
    expect(service).toBeTruthy();
  }));
});

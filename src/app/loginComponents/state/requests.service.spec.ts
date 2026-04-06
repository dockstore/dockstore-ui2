import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestsService } from './requests.service';
import { RequestsStore } from './requests.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RequestsService', () => {
  let requestsService: RequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [RequestsService, RequestsStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    requestsService = TestBed.inject(RequestsService);
    TestBed.inject(RequestsStore);
  });

  it('should be created', () => {
    expect(requestsService).toBeDefined();
  });
});

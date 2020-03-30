import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { version } from '../../../package.json';
import { CustomHeaderInterceptor } from './custom-header.interceptor';

describe('CustomHeaderInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CustomHeaderInterceptor,
          multi: true
        }
      ]
    });
  });

  it('Should add X-Dockstore-UI header', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      http.get('/api').subscribe(response => expect(response).toBeTruthy());
      const request = httpMock.expectOne(req => req.headers.has('X-Dockstore-UI') && req.headers.get('X-Dockstore-UI') === version);

      request.flush({ data: 'test' });
      httpMock.verify();
    }
  ));
});

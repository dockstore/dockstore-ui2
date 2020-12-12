import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { versions } from '../footer/versions';
import { CustomHeaderInterceptor } from './custom-header.interceptor';

describe('CustomHeaderInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CustomHeaderInterceptor,
          multi: true,
        },
      ],
    });
  });

  it('Should add X-Dockstore-UI, X-Session-ID, and X-Request-ID headers', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      http.get('/api').subscribe((response) => expect(response).toBeTruthy());
      const uiVersion = versions.tag;
      const request = httpMock.expectOne(
        (req) =>
          req.headers.has('X-Dockstore-UI') &&
          req.headers.get('X-Dockstore-UI') === uiVersion &&
          req.headers.has('X-Request-ID') &&
          req.headers.has('X-Session-ID')
      );

      request.flush({ data: 'test' });
      httpMock.verify();
    }
  ));
});

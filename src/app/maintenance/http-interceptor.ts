import { Observable } from 'rxjs/Observable';
import { HttpInterceptor } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Http } from '@angular/http';
import {Injectable} from '@angular/core';
import {HttpEvent, HTTP_INTERCEPTORS, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do(event => {}, err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 0 && window.location.pathname !== '/maintenance') {
                    window.location.href = '/maintenance';
                }
            }
        });
      }
}

import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from 'ng2-ui-auth';

@Injectable()
export class HttpService {

  constructor(private http: Http,
              private authService: AuthService) { }

  public getDockstoreToken() {
    return this.authService.getToken();
  }

  private addOptions(dockstoreToken?: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (dockstoreToken) {
      headers.append('Authorization', `Bearer ${ dockstoreToken }`);
    }

    return new RequestOptions({ headers: headers });
  }

  public getHeader(dockstoreToken?: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (dockstoreToken) {
      headers.append('Authorization', `Bearer ${ dockstoreToken }`);
    }
    return headers;
  }

  getAuthResponse(url: string) {
    return this.getResponse(url, this.getDockstoreToken());
  }

  getResponse(url: string, dockstoreToken?: string) {
    return this.http.get(url, this.addOptions(dockstoreToken))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  putResponse(url: string, body, dockstoreToken?: string) {
    return this.http.put(url, body, this.addOptions(this.authService.getToken()))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  deleteAuth(url: string) {
    return this.delete(url, this.getDockstoreToken());
  }

  delete(url: string, dockstoreToken?: string) {
    return this.http.delete(url, this.addOptions(this.authService.getToken()))
      .map((res: Response) => res.text())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }
}

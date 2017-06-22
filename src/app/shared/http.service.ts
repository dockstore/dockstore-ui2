import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from 'ng2-ui-auth';

@Injectable()
export class HttpService {

  constructor(private http: Http,
              private authService: AuthService) { }

  private getDockstoreToken() {
    return this.authService.getToken();
  }

  private addOptions(dockstoreToken?: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (dockstoreToken) {
      headers.append('Authorization', `Bearer ${ dockstoreToken }`);
    }

    return new RequestOptions({ headers: headers });
  }

  private getHeader(dockstoreToken?: string) {
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

  postResponse(url: string, body, dockstoreToken?: string) {
    return this.http.post(url, body, this.addOptions(this.getDockstoreToken()))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  putResponse(url: string, body, dockstoreToken?: string) {
    return this.http.put(url, body, this.addOptions(this.authService.getToken()))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  deleteResponse(url: string, body, dockstoreToken?: string) {
    return this.http.delete(url, new RequestOptions({headers: this.getHeader(dockstoreToken), body: body}))
      .map((res: Response) => res.text())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  deleteAuth(url: string) {
    return this.delete(url, this.getDockstoreToken());
  }

  delete(url: string, dockstoreToken?: string) {
    return this.http.delete(url, this.addOptions(dockstoreToken))
      .map((res: Response) => res.text())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }

  request(url: string, myParams: URLSearchParams,  method: RequestMethod, dockstoreToken?: string) {
    const options = new RequestOptions({
      url: url,
      headers: this.getHeader(this.authService.getToken()),
      method: method,
      params: myParams
    });
    return this.http.request(new Request(options))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || `Server error ${ url }`));
  }
}

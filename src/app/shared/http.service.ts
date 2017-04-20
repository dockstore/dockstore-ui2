import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

  getAuthResponse(url: string) {
    return this.getResponse(url, this.getDockstoreToken());
  }

  getResponse(url: string, dockstoreToken?: string) {
    return this.http.get(url, this.addOptions(dockstoreToken))
      .map((res: Response) => res.json())
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

}

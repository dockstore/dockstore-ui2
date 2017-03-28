import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dockstore } from '../shared/dockstore.model';

@Injectable()
export class DockstoreService {

  constructor(private http: Http) { }

  getResponse(url: string) {
    return this.http.get(url)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getProvider(gitUrl: string): string {
    if (gitUrl.includes('github.com')) {
      return 'Github';
    }

    if (gitUrl.includes('bitbucket.org')) {
      return 'Bitbucket';
    }

    if (gitUrl.includes('gitlab.com')) {
      return 'Gitlab';
    }

    return null;
  }

  getProviderUrl(gitUrl: string, provider: string): string {
      if (!gitUrl) return null;

      let gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
      let matchRes = gitUrlRegExp.exec(gitUrl);

      if (!matchRes) return null;

      let providerUrl = '';

      switch (provider) {
        case 'Github':
          providerUrl = 'https://github.com/';
          break;
        case 'Bitbucket':
          providerUrl = 'https://bitbucket.org/';
          break;
        case 'Gitlab':
          providerUrl = 'https://gitlab.com/';
          break;
        default:
          return null;
      }

      providerUrl += matchRes[1] + '/' + matchRes[2];
      return providerUrl;
  }
}

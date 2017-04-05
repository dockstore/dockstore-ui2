import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dockstore } from '../shared/dockstore.model';

@Injectable()
export class DockstoreService {

  constructor(private http: Http) { }

  getResponse(url: string) {
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getProvider(gitUrl: string): string {
    if (gitUrl.includes('github.com')) {
      return 'GitHub';
    }

    if (gitUrl.includes('bitbucket.org')) {
      return 'Bitbucket';
    }

    if (gitUrl.includes('gitlab.com')) {
      return 'GitLab';
    }

    return null;
  }

  getProviderUrl(gitUrl: string, provider: string): string {
      if (!gitUrl) {
        return null;
      }

      const gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
      const matchRes = gitUrlRegExp.exec(gitUrl);

      if (!matchRes) {
        return null;
      }

      let providerUrl = '';

      switch (provider) {
        case 'GitHub':
          providerUrl = 'https://github.com/';
          break;
        case 'Bitbucket':
          providerUrl = 'https://bitbucket.org/';
          break;
        case 'GitLab':
          providerUrl = 'https://gitlab.com/';
          break;
        default:
          return null;
      }

      providerUrl += matchRes[1] + '/' + matchRes[2];
      return providerUrl;
  }

  private getTime(timestamp: number, convert: number) {
    const timeDiff = (new Date()).getTime() - timestamp;
    return Math.floor(timeDiff / convert);
  }

  getTimeMessage(timestamp: number) {
    const msToMins = 1000 * 60;
    const msToHours = msToMins * 60;
    const msToDays = msToHours * 24;

    let time = this.getTime(timestamp, msToDays);

    if (time < 1) {

      time = this.getTime(timestamp, msToHours);

      if (time < 1) {

        time = this.getTime(timestamp, msToMins);

        if (time < 1) {
          return '< 1 minute ago';
        } else {
          return time + ((time === 1) ? ' minute ago' : ' minutes ago' );
        }

      } else {

        return time + ((time === 1) ? ' hour ago' : ' hours ago');

      }

    } else {

      return time + ((time === 1) ? ' day ago' : ' days ago');

    }
  }

  stripMailTo(email: string) {
    if (email) {
      return email.replace(/^mailto:/, '');
    }

    return null;
  }

}

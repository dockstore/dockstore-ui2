import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Configuration } from './../shared/swagger/configuration';
import { UsersService } from '../shared/swagger';
import { User } from './../shared/swagger/model/user';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class UserService {

  private userSource = new BehaviorSubject<User>(null);

  user$ = this.userSource.asObservable();

  constructor(private httpService: HttpService, private usersService: UsersService, private configuration: Configuration) {
    this.configuration.accessToken = this.httpService.getDockstoreToken();
    this.usersService.getUser().subscribe((user: User) => this.setUser(user));
   }

  setUser(user) {
    this.userSource.next(user);
  }

  gravatarUrl(email: string, defaultImg: string) {
    if (email) {
      return 'https://www.gravatar.com/avatar/' +  Md5.hashStr(email) + '?d=' + defaultImg + '&s=500';
    } else {
      if (defaultImg) {
        return defaultImg;
      } else {
        return 'http://www.imcslc.ca/imc/includes/themes/imc/images/layout/img_placeholder_avatar.jpg';
      }
    }
  }

  getUserTokenStatusSet(userId) {
    let tokenSet;
    this.usersService.getUserTokens(userId).subscribe(
      tokens => {
        const tokenStatusSet = {
          dockstore: false,
          github: false,
          bitbucket: false,
          quayio: false,
          gitlab: false
        };
        for (let i = 0; i < tokens.length; i++) {
          switch (tokens[i].tokenSource) {
            case 'dockstore':
              tokenStatusSet.dockstore = true;
              break;
            case 'github.com':
              tokenStatusSet.github = true;
              break;
            case 'bitbucket.org':
              tokenStatusSet.bitbucket = true;
              break;
            case 'quay.io':
              tokenStatusSet.quayio = true;
              break;
            case 'gitlab.com':
              tokenStatusSet.gitlab = true;
              break;
          }
        }
        tokenSet = tokenStatusSet;
      });
    return tokenSet;
  }

}

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Md5 } from 'ts-md5/dist/md5';

import { UsersService } from '../shared/swagger';
import { Configuration } from './../shared/swagger/configuration';
import { User } from './../shared/swagger/model/user';


/**
 * This service contains the user observable that is returned from usersService.getUser().
 * No other component should be getting the user.  Every component should be getting the user from this service.
 *
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {

  private userSource = new BehaviorSubject<User>(null);

  user$ = this.userSource.asObservable();
  userId$: Observable<number>;
  constructor(private authService: AuthService, private usersService: UsersService, private configuration: Configuration) {
    this.updateUser();
    this.userId$ = this.userSource.map((user: User) => user.id);
   }

  setUser(user) {
    this.userSource.next(user);
  }

  updateUser() {
    this.configuration.accessToken = this.authService.getToken();
    this.usersService.getUser().subscribe((user: User) => this.setUser(user));
  }

  gravatarUrl(email: string, defaultImg: string) {
    if (email) {
      return 'https://www.gravatar.com/avatar/' + Md5.hashStr(email) + '?d=' + defaultImg + '&s=500';
    } else {
      if (defaultImg) {
        return defaultImg;
      } else {
        return 'http://www.gravatar.com/avatar/?d=mm&s=500';
      }
    }
  }
}

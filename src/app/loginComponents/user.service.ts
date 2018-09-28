
import {map} from 'rxjs/operators';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
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
  private extendedUserSource = new BehaviorSubject<any>(null);

  user$ = this.userSource.asObservable();
  userId$: Observable<number>;
  extendedUser$ = this.extendedUserSource.asObservable();

  constructor(private authService: AuthService, private usersService: UsersService, private configuration: Configuration,
    private router: Router) {
    this.updateUser();
    this.userId$ = this.userSource.pipe(map((user: User) => user ? user.id : null));
   }

  setUser(user) {
    this.userSource.next(user);
  }

  setExtendedUser(extendedUser) {
    this.extendedUserSource.next(extendedUser);
  }

  updateUser() {
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? ('Bearer ' + token) : null;
    if (token) {
      // Attempt to get user and extended user data if there's a token because it would 401 otherwise
      this.usersService.getUser().subscribe(
        (user: User) => this.setUser(user),
        error => {
          // TODO: Figure out what to do when error.
          // Currently this function is executed whether the user is logged in or not.
          this.setUser(null);
        }
      );
      this.usersService.getExtendedUserData().subscribe(
        (extendedUser: any) => this.setExtendedUser(extendedUser),
        error => this.setExtendedUser(null)
      );
    } else {
      // No token, no user
      this.setUser(null);
      this.setExtendedUser(null);
    }
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

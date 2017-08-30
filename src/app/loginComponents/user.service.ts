import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Configuration } from './../shared/swagger/configuration';
import { UsersService } from '../shared/swagger';
import { User } from './../shared/swagger/model/user';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';
import { Md5 } from 'ts-md5/dist/md5';


/**
 * This class contains the user observable that is returned from the usersService.getUser() call.
 * No other component should be getting the user.  Every component should be getting the user from this service.
 *
 * @export
 * @class UserService
 */
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
}

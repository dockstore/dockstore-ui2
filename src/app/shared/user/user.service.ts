import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { AuthService } from 'ng2-ui-auth';

import { Configuration, ExtendedUserData, User, UsersService } from '../swagger';
import { UserStore } from './user.store';
import { Md5 } from 'ts-md5/dist/md5';
import { RefreshService } from '../refresh.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private userStore: UserStore, private authService: AuthService, private usersService: UsersService,
    private configuration: Configuration, private refreshService: RefreshService) {
      this.getUser();
  }

  updateUser(user: User) {
    this.userStore.setState(state => {
      return {
        ...state,
        user: user
      };
    });
  }

  updateExtendedUserData(extendeduserData: ExtendedUserData) {
    this.userStore.setState(state => {
      return {
        ...state,
        extendedUserData: extendeduserData
      };
    });
  }

  @transaction()
  remove() {
    this.userStore.update({user: null, extendedUserData: null});
  }

  getUser() {
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? ('Bearer ' + token) : null;
    if (token) {
      // Attempt to get user and extended user data if there's a token because it would 401 otherwise
      this.usersService.getUser().subscribe(
        (user: User) => this.updateUser(user),
        error => {
          // TODO: Figure out what to do when error.
          // Currently this function is executed whether the user is logged in or not.
          this.updateUser(null);
        }
      );
      this.usersService.getExtendedUserData().subscribe(
        (extendedUser: any) => this.updateExtendedUserData(extendedUser),
        error => this.updateExtendedUserData(null)
      );
    } else {
      // No token, no user
      this.remove();
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

    /**
   * Attempts to update the username to the new value given by the user
   */
  updateUsername(username: string) {
    this.usersService.changeUsername(username).subscribe(
      (user: User) => {
        this.getUser();
        this.refreshService.handleSuccess('Updating username');
      }, error => {
        console.error(error);
        this.refreshService.handleError('Updating username', error);
      });
  }
}

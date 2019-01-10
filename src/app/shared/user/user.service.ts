import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { AuthService } from 'ng2-ui-auth';

import { Configuration, ExtendedUserData, User, UsersService } from '../swagger';
import { UserStore } from './user.store';
import { Md5 } from 'ts-md5/dist/md5';
import { RefreshService } from '../refresh.service';
import { TokenService } from '../state/token.service';
import { AlertService } from '../alert/state/alert.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private userStore: UserStore, private authService: AuthService, private usersService: UsersService,
    private configuration: Configuration, private refreshService: RefreshService, private tokenService: TokenService,
    private alertService: AlertService) {
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
    this.userStore.update({ user: null, extendedUserData: null });
    this.tokenService.removeAll();
  }

  setupConfigurationToken(): void {
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? ('Bearer ' + token) : null;
  }

  getExtendedUserData(): void {
    this.setupConfigurationToken();
    if (this.configuration.apiKeys['Authorization']) {
      this.usersService.getExtendedUserData().subscribe(
        (extendedUserData: ExtendedUserData) => this.updateExtendedUserData(extendedUserData),
        error => this.updateExtendedUserData(null));
    } else {
      this.updateExtendedUserData(null);
    }
  }

  getSingleUser(): void {
    this.setupConfigurationToken();
    if (this.configuration.apiKeys['Authorization']) {
      this.usersService.getUser().subscribe(
        (user: User) => {
          this.updateUser(user);
          if (user) {
            this.tokenService.get(user.id);
          } else {
            this.tokenService.removeAll();
          }
        },
        error => {
          this.updateUser(null);
          this.tokenService.removeAll();
        });
    } else {
      this.updateUser(null);
      this.tokenService.removeAll();
    }
  }

  @transaction()
  getUser(): void {
    // Attempt to get user and extended user data if there's a token because it would 401 otherwise
    this.getSingleUser();
    this.getExtendedUserData();
  }

  gravatarUrl(email: string, defaultImg: string): string {
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
  updateUsername(username: string): void {
    this.alertService.start('Updating username');
    this.usersService.changeUsername(username).subscribe(
      (user: User) => {
        this.getUser();
        this.alertService.detailedSuccess();
      }, error => {
        this.alertService.detailedError(error);
      });
  }
}

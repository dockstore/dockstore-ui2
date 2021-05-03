import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { transaction } from '@datorama/akita';
import { AuthService } from 'ng2-ui-auth';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { AlertService } from '../alert/state/alert.service';
import { TokenQuery } from '../state/token.query';
import { TokenService } from '../state/token.service';
import { WorkflowService } from '../state/workflow.service';
import { Configuration, ExtendedUserData, User, UsersService, Workflow } from '../swagger';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService {
  orcidAccountIsLinked$: Observable<boolean>;
  constructor(
    private userStore: UserStore,
    private authService: AuthService,
    private usersService: UsersService,
    private configuration: Configuration,
    private tokenService: TokenService,
    private alertService: AlertService,
    private workflowService: WorkflowService,
    private router: Router,
    private tokenQuery: TokenQuery
  ) {
    this.getUser(false);
  }

  updateUser(user: User) {
    this.userStore.update((state) => {
      return {
        ...state,
        user: user,
      };
    });
  }

  updateExtendedUserData(extendeduserData: ExtendedUserData) {
    this.userStore.update((state) => {
      return {
        ...state,
        extendedUserData: extendeduserData,
      };
    });
  }

  addUserToWorkflows(userId: number): void {
    this.alertService.start('Adding user to existing workflows on Dockstore');
    this.usersService.addUserToDockstoreWorkflows(userId).subscribe(
      (workflows: Array<Workflow>) => {
        this.alertService.detailedSuccess();
        this.workflowService.setWorkflows(workflows);
      },
      (error) => this.alertService.detailedError(error)
    );
  }

  @transaction()
  remove() {
    this.userStore.update({ user: null, extendedUserData: null });
    this.tokenService.removeAll();
  }

  setupConfigurationToken(): void {
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? 'Bearer ' + token : null;
  }

  getExtendedUserData(): void {
    this.setupConfigurationToken();
    if (this.configuration.apiKeys['Authorization']) {
      this.usersService.getExtendedUserData().subscribe(
        (extendedUserData: ExtendedUserData) => this.updateExtendedUserData(extendedUserData),
        (error) => this.updateExtendedUserData(null)
      );
    } else {
      this.updateExtendedUserData(null);
    }
  }

  getSingleUser(redirectAfterSuccess: boolean, url?: string): void {
    this.setupConfigurationToken();
    if (this.configuration.apiKeys['Authorization']) {
      this.usersService.getUser().subscribe(
        (user: User) => {
          this.updateUser(user);
          if (user) {
            this.tokenService.get(user.id);
            if (redirectAfterSuccess) {
              switch (url) {
                case '/orcid':
                  this.orcidAccountIsLinked$ = this.tokenQuery.hasOrcidToken$;
                  this.orcidAccountIsLinked$.subscribe((orcidLinked: boolean) => {
                    if (orcidLinked) {
                      this.router.navigateByUrl(url);
                    }
                  });
                  break;
                default:
                  break;
              }
            }
          } else {
            this.tokenService.removeAll();
          }
        },
        (error) => {
          this.updateUser(null);
          this.tokenService.removeAll();
        }
      );
    } else {
      this.updateUser(null);
      this.tokenService.removeAll();
    }
  }

  @transaction()
  getUser(redirect: boolean, url?: string): void {
    // Attempt to get user and extended user data if there's a token because it would 401 otherwise
    url ? this.getSingleUser(redirect, url) : this.getSingleUser(redirect);
    this.getExtendedUserData();
  }

  gravatarUrl(email: string, defaultImg: string): string {
    if (email) {
      return 'https://www.gravatar.com/avatar/' + Md5.hashStr(email) + '?d=' + defaultImg + '&s=500';
    } else {
      if (defaultImg) {
        return defaultImg;
      } else {
        return 'https://www.gravatar.com/avatar/?d=mm&s=500';
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
        this.getUser(false);
        this.alertService.detailedSuccess();
      },
      (error) => {
        this.alertService.detailedError(error);
      }
    );
  }
}

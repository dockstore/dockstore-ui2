import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { transaction } from '@datorama/akita';
import { AuthService } from 'ng2-ui-auth';
import { GravatarService } from '../../gravatar/gravatar.service';
import { AlertService } from '../alert/state/alert.service';
import { TokenService } from '../state/token.service';
import { WorkflowService } from '../state/workflow.service';
import { Configuration, ExtendedUserData, User, UsersService, Workflow } from '../swagger';
import { TrackLoginService } from '../track-login.service';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private userStore: UserStore,
    private authService: AuthService,
    private usersService: UsersService,
    private configuration: Configuration,
    private tokenService: TokenService,
    private alertService: AlertService,
    private workflowService: WorkflowService,
    private trackLoginService: TrackLoginService,
    private router: Router,
    private gravatarService: GravatarService
  ) {
    this.getUser();
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
        (error) => {
          this.updateUser(null);
          this.tokenService.removeAll();
          this.logout();
        }
      );
    } else {
      this.updateUser(null);
      this.tokenService.removeAll();
    }
  }

  logout(routeChange?: string) {
    this.authService.logout().subscribe({
      complete: () => {
        this.remove();
        this.trackLoginService.switchState(false);
        routeChange ? this.router.navigate([routeChange]) : this.router.navigate(['/logout']);
      },
    });
  }

  @transaction()
  getUser(): void {
    // Attempt to get user and extended user data if there's a token because it would 401 otherwise
    this.getSingleUser();
    this.getExtendedUserData();
  }

  gravatarUrl(defaultImg: string | null): string | null {
    if (defaultImg) {
      return defaultImg;
    } else {
      return this.gravatarService.gravatarUrlForMysteryPerson();
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
      },
      (error) => {
        this.alertService.detailedError(error);
      }
    );
  }
}

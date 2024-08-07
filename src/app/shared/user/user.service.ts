import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { transaction } from '@datorama/akita';
import { GravatarService } from '../../gravatar/gravatar.service';
import { AuthService } from '../../ng2-ui-auth/public_api';
import { AlertService } from '../alert/state/alert.service';
import { TokenService } from '../state/token.service';
import { MyWorkflowsService } from '../../myworkflows/myworkflows.service';
import { MytoolsService } from '../../mytools/mytools.service';
import { EntryType } from '../enum/entry-type';
import { Configuration, ExtendedUserData, User, UsersService, Workflow } from '../openapi';
import { TrackLoginService } from '../track-login.service';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService {
  EntryType = EntryType;
  constructor(
    private userStore: UserStore,
    private authService: AuthService,
    private usersService: UsersService,
    private configuration: Configuration,
    private tokenService: TokenService,
    private alertService: AlertService,
    private myWorkflowsService: MyWorkflowsService,
    private mytoolsService: MytoolsService,
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

  /**
   * Add Workflows and GitHub App Tools from a user's organization
   *
   * @param userId
   */
  addUserToWorkflows(userId: number, entryType: EntryType): void {
    this.alertService.start('Adding user to existing workflows and tools on Dockstore');
    this.usersService.addUserToDockstoreWorkflows(userId).subscribe(
      (workflows: Array<Workflow>) => {
        this.alertService.detailedSuccess();
        // This endpoint currently only returns the user's BioWorkflows, and not workflows of all types.
        // For consistency, ignoring the workflows response and re-requesting entries of the desired type.
        if (entryType === EntryType.Tool) {
          this.mytoolsService.getMyEntries(userId, entryType);
        } else {
          this.myWorkflowsService.getMyEntries(userId, entryType);
        }
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

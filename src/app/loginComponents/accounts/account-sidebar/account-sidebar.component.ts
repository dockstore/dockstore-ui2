import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertQuery } from '../../../shared/alert/state/alert.query';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { TokenSource } from '../../../shared/enum/token-source.enum';
import { TokenQuery } from '../../../shared/state/token.query';
import { Profile, User } from '../../../shared/swagger';
import { UsersService } from '../../../shared/swagger/api/users.service';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss'],
})
export class AccountSidebarComponent implements OnInit {
  user: User;
  TokenSource = TokenSource;
  googleProfile: Profile;
  gitHubProfile: Profile;
  hasGitHubToken$: Observable<boolean>;
  hasGoogleToken$: Observable<boolean>;
  public isRefreshing$: Observable<boolean>;
  public syncBadgeGit: boolean = false;
  public syncBadgeGoogle: boolean = false;
  constructor(
    private userService: UserService,
    private usersService: UsersService,
    private tokenQuery: TokenQuery,
    private userQuery: UserQuery,
    private alertQuery: AlertQuery,
    private alertService: AlertService
  ) {
    this.hasGitHubToken$ = this.tokenQuery.hasGitHubToken$;
    this.hasGoogleToken$ = this.tokenQuery.hasGoogleToken$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }

  /**
   * Update user metadata for a service
   *
   * @param {TokenSource} service  TokenSource.GITHUB or TokenSource.GOOGLE
   * @memberof AccountSidebarComponent
   */
  sync(service: TokenSource.GOOGLE | TokenSource.GITHUB) {
    this.alertService.start('Updating user metadata');
    this.usersService.updateLoggedInUserMetadata(service).subscribe(
      (user: User) => {
        this.userService.updateUser(user);
        this.alertService.simpleSuccess();
        if (service === TokenSource.GITHUB) {
          this.syncBadgeGit = true;
        }
        if (service === TokenSource.GOOGLE) {
          this.syncBadgeGoogle = true;
        }
      },
      (error) => {
        this.alertService.simpleError();
      }
    );
  }

  private getUser() {
    this.userQuery.user$.subscribe((user: User) => {
      this.user = user;
      if (user) {
        if (!this.user.avatarUrl) {
          this.user.avatarUrl = this.userService.gravatarUrl(null, null);
        }
        const userProfiles = user.userProfiles;
        if (userProfiles) {
          this.googleProfile = userProfiles[TokenSource.GOOGLE];
          // Using gravatar for Google also, may result in two identical pictures if both accounts use the same email address
          if (this.googleProfile && !this.googleProfile.avatarURL) {
            this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.email, this.googleProfile.avatarURL);
          }
          this.gitHubProfile = userProfiles[TokenSource.GITHUB];
          if (this.gitHubProfile && !this.gitHubProfile.avatarURL) {
            this.gitHubProfile.avatarURL = this.userService.gravatarUrl(this.gitHubProfile.email, this.gitHubProfile.avatarURL);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.getUser();
  }
}

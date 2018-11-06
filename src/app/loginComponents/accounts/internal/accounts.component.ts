import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { TokenSource } from '../../../shared/enum/token-source.enum';
import { TokenQuery } from '../../../shared/state/token.query';
import { Configuration, Profile, User } from '../../../shared/swagger';
import { UsersService } from '../../../shared/swagger/api/users.service';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { AlertQuery } from '../../../shared/alert/state/alert.query';

@Component({
  selector: 'app-accounts-internal',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsInternalComponent implements OnInit {
  user: User;
  TokenSource = TokenSource;
  googleProfile: Profile;
  gitHubProfile: Profile;
  hasGitHubToken$: Observable<boolean>;
  hasGoogleToken$: Observable<boolean>;
  public isRefreshing$: Observable<boolean>;
  constructor(private userService: UserService, private usersService: UsersService, private configuration: Configuration,
    private tokenQuery: TokenQuery, private matSnackBar: MatSnackBar, private userQuery: UserQuery, private alertQuery: AlertQuery,
    private alertService: AlertService) {
    this.hasGitHubToken$ = this.tokenQuery.hasGitHubToken$;
    this.hasGoogleToken$ = this.tokenQuery.hasGoogleToken$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }

  /**
   * Update user metadata for a service
   *
   * @param {TokenSource} service  TokenSource.GITHUB or TokenSource.GOOGLE
   * @memberof AccountsInternalComponent
   */
  sync(service: TokenSource.GOOGLE | TokenSource.GITHUB) {
    this.alertService.start('Updating user metadata');
    this.usersService.updateLoggedInUserMetadata(service).subscribe((user: User) => {
      this.userService.updateUser(user);
      this.alertService.simpleSuccess();
    }, error => {
      this.alertService.simpleError();
    },
    );
  }

  private getUser() {
    this.userQuery.user$.subscribe((user: User) => {
      this.user = user;
      if (user) {
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
    }
    );

  }

  ngOnInit() {
    this.getUser();
  }
}

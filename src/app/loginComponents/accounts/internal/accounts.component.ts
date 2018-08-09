import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Observable } from 'rxjs';

import { Configuration, Profile, User } from '../../../shared/swagger';
import { TokenService } from '../../token.service';
import { UserService } from '../../user.service';
import { UsersService } from './../../../shared/swagger/api/users.service';

@Component({
  selector: 'app-accounts-internal',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsInternalComponent implements OnInit {
  user: User;
  googleProfile: Profile;
  gitHubProfile: Profile;
  hasGitHubToken$: Observable<boolean>;
  hasGoogleToken$: Observable<boolean>;
  show: false;
  public syncing = false;
  constructor(private userService: UserService, private usersService: UsersService, private configuration: Configuration,
    private authService: AuthService, private tokenService: TokenService) {
      this.hasGitHubToken$ = this.tokenService.hasGitHubToken$;
      this.hasGoogleToken$ = this.tokenService.hasGoogleToken$;
    }

  syncGitHub() {
    this.syncing = true;
    this.usersService.updateLoggedInUserMetadata('github.com').subscribe((user: User) => {
      this.userService.setUser(user);
      this.syncing = false;
    }, error => {
      this.syncing = false;
    }
    );
  }

  syncGoogle() {
    this.syncing = true;
    this.usersService.updateLoggedInUserMetadata('google.com').subscribe((user: User) => {
      this.userService.setUser(user);
      this.syncing = false;
    }, error => {
      this.syncing = false;
    },
    );
  }


  // TODO: Fix, it is called a bajillion times
  getDockstoreToken(): string {
    return this.authService.getToken();
  }

  private getUser() {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
      if (user) {
        const userProfiles = user.userProfiles;
        if (userProfiles) {
        this.googleProfile = userProfiles['google.com'];
        // Using gravatar for Google also, may result in two identical pictures if both accounts use the same email address
        if (this.googleProfile && !this.googleProfile.avatarURL) {
          this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.email, this.googleProfile.avatarURL);
        }
        this.gitHubProfile = userProfiles['github.com'];
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

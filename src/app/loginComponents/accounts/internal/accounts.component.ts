import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Observable } from 'rxjs/Observable';

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
  user;
  googleProfile: Profile;
  gitHubProfile: Profile;
  hasGitHubToken$: Observable<boolean>;
  hasGoogleToken$: Observable<boolean>;
  public syncingWithGitHub = false;
  public syncingWithGoogle = false;
  constructor(private userService: UserService, private usersService: UsersService, private configuration: Configuration,
    private authService: AuthService, private tokenService: TokenService) {
      this.hasGitHubToken$ = this.tokenService.hasGitHubToken$;
      this.hasGoogleToken$ = this.tokenService.hasGoogleToken$;
    }

  syncGitHub() {
    this.syncingWithGitHub = true;
    this.usersService.updateLoggedInUserMetadata('github.com').subscribe((user: User) => {
      this.userService.setUser(user);
      this.syncingWithGitHub = false;
    }, error => {
      this.syncingWithGitHub = false;
    }
    );
  }

  syncGoogle() {
    this.syncingWithGoogle = true;
    this.usersService.updateLoggedInUserMetadata('google.com').subscribe((user: User) => {
      this.userService.setUser(user);
      this.syncingWithGoogle = false;
    }, error => {
      this.syncingWithGoogle = false;
    },
    );
  }


  getDockstoreToken(): string {
    return this.authService.getToken();
  }

  private getUser() {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.setProperty();
        const userProfiles = user.userProfile;
        this.googleProfile = userProfiles['google.com'];
        // Using gravatar for Google also, may result in two identical pictures if both accounts use the same email address
        if (this.googleProfile && this.googleProfile.avatarURL) {
          this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.email, this.googleProfile.avatarURL);
        }
        this.gitHubProfile = userProfiles['github.com'];
        if (this.gitHubProfile && this.gitHubProfile.avatarURL) {
          this.gitHubProfile.avatarURL = this.userService.gravatarUrl(this.gitHubProfile.email, this.gitHubProfile.avatarURL);
        }
      }
    }
    );

  }
  private setProperty() {
    this.user.avatarUrl = this.userService.gravatarUrl(this.user.email, this.user.avatarUrl);
  }
  ngOnInit() {
    this.getUser();
  }
}

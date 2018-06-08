import { AuthService } from 'ng2-ui-auth';
import { Configuration, User, Profile } from '../../../shared/swagger';
import { UsersService } from './../../../shared/swagger/api/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-accounts-internal',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsInternalComponent implements OnInit {
  user;
  googleProfile: Profile;
  gitHubProfile: Profile;
  public syncingWithGitHub = false;
  public syncingWithGoogle = false;
  constructor(private userService: UserService, private usersService: UsersService, private configuration: Configuration,
    private authService: AuthService) { }

  syncGitHub() {
    this.syncingWithGitHub = true;
    this.usersService.updateLoggedInUserMetadata('github.com').subscribe(user => {
      this.user = user;
      this.user.avatarUrl = this.userService.gravatarUrl(this.user.email, this.user.avatarUrl);
      this.syncingWithGitHub = false;
    }, error => {
      this.syncingWithGitHub = false;
    }
    );
  }

  syncGoogle() {
    this.syncingWithGoogle = true;
    this.usersService.updateLoggedInUserMetadata('google.com').subscribe(user => {
      this.user = user;
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
        // Only do gravatarURL for GitHub.com
        // this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.email, this.googleProfile.avatarURL);
        this.gitHubProfile = userProfiles['github.com'];
        this.gitHubProfile.avatarURL = this.userService.gravatarUrl(this.gitHubProfile.email, this.gitHubProfile.avatarURL);
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

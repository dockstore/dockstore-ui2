import { AuthService } from 'ng2-ui-auth';
import { Configuration } from '../../../shared/swagger';
import { UsersService } from './../../../shared/swagger/api/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-accounts-internal',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsInternalComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  user;
  syncingWithGithub: boolean;

  constructor(private userService: UserService, private usersService: UsersService, private configuration: Configuration,
    private authService: AuthService) { }

  syncGitHub() {
    this.syncingWithGithub = true;
    this.usersService.updateUserMetadata().subscribe(user => {
        this.user = user;
        this.user.avatarUrl = this.userService.gravatarUrl(this.user.email, this.user.avatarUrl);
        this.syncingWithGithub = false;
    }
    );
  }

  private getUser() {
    this.configuration.accessToken = this.authService.getToken();
    this.subscription = this.usersService.getUser().subscribe(user => {
        this.user = user;
        this.setProperty();
      }
    );

  }
  private setProperty() {
    this.user.avatarUrl = this.userService.gravatarUrl(this.user.email, this.user.avatarUrl);
  }
  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

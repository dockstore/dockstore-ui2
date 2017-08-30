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
export class AccountsInternalComponent implements OnInit {
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
    this.userService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.setProperty();
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

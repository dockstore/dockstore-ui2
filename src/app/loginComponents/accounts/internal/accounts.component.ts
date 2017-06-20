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

  constructor(private userService: UserService) { }

  syncGitHub() {
    this.syncingWithGithub = true;
    this.userService.updateUser().subscribe(user => {
        this.user = user;
        this.user.avatarUrl = this.userService.gravatarUrl(this.user.email, this.user.avatarUrl);
        this.syncingWithGithub = false;
    }
    );
  }

  private getUser() {
    this.subscription = this.userService.getUser().subscribe(user => {
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

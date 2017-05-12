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

  constructor(private userService: UserService) { }

  syncGitHub() {
    this.userService.updateUser().subscribe(user =>
      this.user = user
    );
  }

  private getUser() {
    this.subscription = this.userService.user$.subscribe(user =>
      this.user = user
    );
  }

  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

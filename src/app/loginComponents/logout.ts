import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TrackLoginService } from '../shared/track-login.service';
import { LogoutService } from '../shared/logout.service';

@Injectable()
export class Logout implements OnDestroy {

  loginStateSubscription: Subscription;
  public isLoggedIn: boolean;

  constructor(private trackLoginService: TrackLoginService,
              private logoutService: LogoutService,
              private router: Router) {
    this.loginStateSubscription = this.trackLoginService.isLoggedIn$.subscribe(state => this.isLoggedIn = state);
  }

  logout() {
    this.logoutService.logout();
  }

  ngOnDestroy() {
    this.loginStateSubscription.unsubscribe();
  }

}

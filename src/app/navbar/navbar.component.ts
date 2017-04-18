import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TrackLoginService } from '../shared/track-login.service';
import { LogoutService } from '../shared/logout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {

  subscription: Subscription;
  isLoggedIn: boolean;

  constructor(private trackLoginService: TrackLoginService,
              private logoutService: LogoutService) {
    this.subscription = this.trackLoginService.isLoggedIn$.subscribe(
      state => {
        this.isLoggedIn = state;
        console.log(this.isLoggedIn);
      }
    );
  }

  logout() {
    this.logoutService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { Base } from '../shared/base';
import { LogoutService } from '../shared/logout.service';
import { TrackLoginService } from '../shared/track-login.service';

@Injectable()
export class Logout extends Base {
  public isLoggedIn: boolean;

  constructor(private trackLoginService: TrackLoginService, private logoutService: LogoutService, protected router: Router) {
    super();
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => (this.isLoggedIn = state));
  }

  logout(routeChange?: string) {
    routeChange ? this.logoutService.logout(routeChange) : this.logoutService.logout();
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'ng2-ui-auth';

import { TrackLoginService } from '../shared/track-login.service';

@Injectable()
export class LogoutService {

  constructor(private trackLoginService: TrackLoginService,
              private router: Router,
              private auth: AuthService) { }

  logout() {
    this.auth.logout()
      .subscribe({
        complete: () => {
          this.trackLoginService.switchState(false);
          this.router.navigate(['/login']);
        }
      }
    );
  }
}

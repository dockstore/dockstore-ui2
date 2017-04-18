import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from 'ng2-ui-auth';

@Injectable()
export class TrackLoginService {
  private isLoggedIn: Subject<boolean> = new BehaviorSubject(this.authService.isAuthenticated());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  dockstoreToken: string;

  constructor(private authService: AuthService) { }
  switchState(state: boolean) {
    this.isLoggedIn.next(state);

    if (state) {
      this.dockstoreToken = this.authService.getToken();
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ExtendedUserData, User, UsersService } from '../../shared/swagger';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit, OnDestroy {
  public tokenSetComplete;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  extendedUser: ExtendedUserData;
  user: User;
  ready = false;
  constructor(private userService: UserService, private usersService: UsersService, private tokenService: TokenService) {
  }
  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
    this.tokenService.tokens$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      tokens => {
        if (tokens) {
          const tokenStatusSet = this.tokenService.getUserTokenStatusSet(tokens);
          if (tokenStatusSet) {
            this.tokenSetComplete = tokenStatusSet.github;
          }
        }
      }
    );
    combineLatest(this.userService.user$, this.userService.extendedUser$).pipe(
      distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe(
      ([user, extendedUser]) => {
        this.user = user;
        this.extendedUser = extendedUser;
        if (user && extendedUser) {
          this.ready = true;
        }
      }, error => {
        console.error('Error combining user$ and extendedUser$.  This should never happen: ' + error);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

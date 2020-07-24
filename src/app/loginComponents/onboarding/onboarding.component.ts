import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenQuery } from '../../shared/state/token.query';
import { ExtendedUserData, User } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, OnDestroy {
  public tokenSetComplete: boolean;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  extendedUser: ExtendedUserData;
  user: User;
  ready = false;
  Dockstore = Dockstore;
  constructor(private userQuery: UserQuery, private tokenService: TokenQuery) {}
  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
    this.tokenService.userTokenStatusSet$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tokenStatusSet => {
      if (tokenStatusSet) {
        this.tokenSetComplete = tokenStatusSet.github;
      }
    });
    combineLatest([this.userQuery.user$, this.userQuery.extendedUserData$])
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        ([user, extendedUser]) => {
          this.user = user;
          this.extendedUser = extendedUser;
          if (user && extendedUser) {
            this.ready = true;
          }
        },
        error => {
          console.error('Error combining user$ and extendedUser$.  This should never happen: ' + error);
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenQuery } from '../../shared/state/token.query';
import { ExtendedUserData, User } from '../../shared/openapi';
import { UserQuery } from '../../shared/user/user.query';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { DownloadCLIClientComponent } from './downloadcliclient/downloadcliclient.component';
import { AccountsExternalComponent } from '../accounts/external/accounts.component';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { ChangeUsernameComponent } from '../accounts/internal/change-username/change-username.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    MatIconModule,
    NgIf,
    MatStepperModule,
    ChangeUsernameComponent,
    MatLegacyButtonModule,
    AccountsExternalComponent,
    DownloadCLIClientComponent,
    FlexModule,
    RouterLink,
    MatDividerModule,
  ],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  public tokenSetComplete: boolean;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  extendedUser: ExtendedUserData;
  user: User;
  ready = false;
  Dockstore = Dockstore;
  usernameChangeRequired: boolean = false;
  constructor(private userQuery: UserQuery, private tokenService: TokenQuery) {}
  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
    this.tokenService.userTokenStatusSet$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tokenStatusSet) => {
      if (tokenStatusSet) {
        this.tokenSetComplete = tokenStatusSet.github;
      }
    });
    combineLatest([this.userQuery.user$, this.userQuery.extendedUserData$])
      .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe(
        ([user, extendedUser]) => {
          this.user = user;
          this.extendedUser = extendedUser;
          if (user && extendedUser) {
            this.ready = true;
            this.usernameChangeRequired = this.user.usernameChangeRequired;
          }
        },
        (error) => {
          console.error('Error combining user$ and extendedUser$.  This should never happen: ' + error);
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

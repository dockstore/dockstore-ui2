import { Configuration } from './../../../shared/swagger/configuration';
import { AuthService } from 'ng2-ui-auth';
import { UsersService } from './../../../shared/swagger/api/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ISubscription } from 'rxjs/Subscription';

import { Links } from './links.model';

import { UserService } from '../../user.service';
import { TokenService } from '../../token.service';
import { TrackLoginService } from '../../../shared/track-login.service';

@Component({
  selector: 'app-accounts-external',
  templateUrl: './accounts.component.html'
})
export class AccountsExternalComponent implements OnInit, OnDestroy {

  accountsInfo: Array<any> = [
    {
      name: 'GitHub',
      source: 'github.com',
      bold: 'Required',
      message: 'GitHub credentials are used for login purposes as well as for pulling source code from GitHub.'
    },
    {
      name: 'Quay.io',
      source: 'quay.io',
      bold: 'Optional',
      message: 'Quay.io credentials are used for pulling information about Docker images and automated builds.'
    },
    {
      name: 'Bitbucket',
      source: 'bitbucket.org',
      bold: 'Optional',
      message: 'Bitbucket credentials are used for pulling source code from Bitbucket.'
    },
    {
      name: 'GitLab',
      source: 'gitlab.com',
      bold: 'Optional',
      message: 'GitLab credentials are used for pulling source code from GitLab.'
    }
  ];

  private tokens;
  private userId;
  private tokensSubscription: ISubscription;
  private deleteSubscription: ISubscription;
  private routeSubscription: ISubscription;

  constructor(private trackLoginService: TrackLoginService, private tokenService: TokenService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private usersService: UsersService,
    private authService: AuthService, private configuration: Configuration) {
    this.routeSubscription = this.trackLoginService.isLoggedIn$.subscribe(
      state => {
        if (!state) {
          this.router.navigate(['']);
        }
      }
    );
  }

  private stripSpace(url: string): string {
    return url.replace(/\s/g, '');
  }

  private openWindow(url: string): void {
    window.location.href = this.stripSpace(url);
  }

  // Open a window for the user to login to the appropriate service
  link(source: string) {
    switch (source) {
      case 'github.com':
        this.openWindow(Links.GITHUB);
        break;
      case 'bitbucket.org':
        this.openWindow(Links.BITBUCKET);
        break;
      case 'gitlab.com':
        this.openWindow(Links.GITLAB);
        break;
      case 'quay.io':
        this.openWindow(Links.QUAY);
        break;
    }
  }

  // Delete token by id
  private deleteToken(source: string) {
    for (const token of this.tokens) {
      if (token.tokenSource === source) {
        return this.tokenService.deleteToken(token.id);
      }
    }
  }

  // Unlink account in accountsInfo
  private unlinkToken(source) {
    for (const account of this.accountsInfo) {
      if (account.source === source) {
        account.isLinked = false;
      }
    }
  }

  // Delete a token and unlink service in the UI
  unlink(source: string) {
    this.deleteSubscription = this.deleteToken(source)
      .subscribe(() => this.unlinkToken(source));
  }

  // Show linked services in the UI
  private setAvailableTokens(tokens) {
    for (const token of tokens) {
      for (const account of this.accountsInfo) {
        if (token.tokenSource === account.source) {
          account.isLinked = true;
        }
      }
    }
  }

  // Set tokens and linked services
  private setTokens(tokens): void {
    this.tokens = tokens;
    if (tokens) {
      this.setAvailableTokens(tokens);
    }
  }

  ngOnInit() {
    this.tokenService.tokens$.subscribe(tokens => this.setTokens(tokens));
  }

  ngOnDestroy() {
    if (this.tokensSubscription) {
      this.tokensSubscription.unsubscribe();
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }

    this.routeSubscription.unsubscribe();
  }

}

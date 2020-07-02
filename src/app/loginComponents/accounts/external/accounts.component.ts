/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Dockstore } from '../../../shared/dockstore.model';
import { TokenSource } from '../../../shared/enum/token-source.enum';
import { TokenQuery } from '../../../shared/state/token.query';
import { TokenService } from '../../../shared/state/token.service';
import { TrackLoginService } from '../../../shared/track-login.service';
import { UserService } from '../../../shared/user/user.service';
import { Token } from './../../../shared/swagger/model/token';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts-external',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsExternalComponent implements OnInit, OnDestroy {
  public dsServerURI: any;
  // TODO: Uncomment section when GitLab is enabled
  accountsInfo: Array<any> = [
    {
      name: 'GitHub',
      source: TokenSource.GITHUB,
      bold: 'One of GitHub or Google is required.',
      message: 'GitHub credentials are used for login purposes as well as for pulling source code from GitHub.',
      show: false,
      logo: 'github.svg'
    },
    {
      name: 'Google',
      source: TokenSource.GOOGLE,
      bold: 'One of GitHub or Google is required.',
      message: 'Google credentials are used for login purposes and integration with Terra.',
      show: false,
      logo: 'google.svg'
    },
    {
      name: 'Quay',
      source: TokenSource.QUAY,
      bold: '',
      message: 'Quay.io credentials are used for pulling information about Docker images and automated builds.',
      show: false,
      logo: 'quay.svg'
    },
    {
      name: 'Bitbucket',
      source: TokenSource.BITBUCKET,
      bold: '',
      message: 'Bitbucket credentials are used for pulling source code from Bitbucket.',
      show: false,
      logo: 'bitbucket.svg'
    },
    {
      name: 'GitLab',
      source: TokenSource.GITLAB,
      bold: '',
      message: 'GitLab credentials are used for pulling source code from GitLab.',
      show: false,
      logo: 'gitlab.svg'
    },
    {
      name: 'Zenodo',
      source: TokenSource.ZENODO,
      bold: '',
      message: 'Zenodo credentials are used for creating Digital Object Identifiers (DOIs) on Zenodo.',
      show: false,
      logo: 'zenodo.jpg'
    },
    {
      name: 'ORCID',
      source: TokenSource.ORCID,
      bold: '',
      message: 'ORCID credentials are used for linking ORCID IDs to workflows published on Zenodo.',
      show: false,
      logo: 'orcid.svg'
    }
  ];

  public tokens: Token[];
  private ngUnsubscribe: Subject<{}> = new Subject();
  public show: false;
  public dockstoreToken: string;
  constructor(
    private trackLoginService: TrackLoginService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private accountsService: AccountsService,
    private matSnackBar: MatSnackBar,
    private tokenQuery: TokenQuery
  ) {
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(state => {
      if (!state) {
        this.router.navigate(['']);
      }
    });
    this.dockstoreToken = this.getDockstoreToken();
  }

  // Delete token by id
  private deleteToken(source: string) {
    for (const token of this.tokens) {
      if (token.tokenSource === source) {
        return this.tokenService.deleteToken(token.id);
      }
    }
  }

  relink(source: string): void {
    this.deleteToken(source)
      .pipe(first())
      .subscribe(
        () => {
          this.link(source);
        },
        error => {
          this.matSnackBar.open('Failed to relink ' + source + ' account', 'Dismiss');
        }
      );
  }

  link(source: string): void {
    this.matSnackBar.open('Linking ' + source + ' account', 'Dismiss');
    this.accountsService.link(source);
  }

  // Delete a token and unlink service in the UI
  unlink(source: string) {
    this.deleteToken(source)
      .pipe(first())
      .subscribe(
        () => {
          this.userService.getUser();
          this.matSnackBar.open('Unlinked ' + source + ' account', 'Dismiss');
        },
        error => {
          this.matSnackBar.open('Failed to unlink ' + source, 'Dismiss');
        }
      );
  }

  // Show linked services in the UI
  private setAvailableTokens(tokens: Token[]) {
    for (const account of this.accountsInfo) {
      const found = tokens.find(token => token.tokenSource === account.source);
      if (found) {
        account.isLinked = true;
      } else {
        account.isLinked = false;
      }
    }
  }

  // Set tokens and linked services
  private setTokens(tokens: Token[]): void {
    this.tokens = tokens;
    if (tokens) {
      this.setAvailableTokens(tokens);
    }
  }

  getDockstoreToken(): string {
    return this.authService.getToken();
  }

  ngOnInit() {
    this.dsServerURI = Dockstore.API_URI;
    this.tokenQuery.tokens$.subscribe((tokens: Token[]) => {
      this.setTokens(tokens);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

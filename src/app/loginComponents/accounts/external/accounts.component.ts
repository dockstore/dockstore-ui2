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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Subject } from 'rxjs/Subject';

import { TokenSource } from '../../../shared/enum/token-source.enum';
import { TrackLoginService } from '../../../shared/track-login.service';
import { TokenService } from '../../token.service';
import { UserService } from '../../user.service';
import { UsersService } from './../../../shared/swagger/api/users.service';
import { Configuration } from './../../../shared/swagger/configuration';
import { Token } from './../../../shared/swagger/model/token';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts-external',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsExternalComponent implements OnInit, OnDestroy {

  // TODO: Uncomment section when GitLab is enabled
  accountsInfo: Array<any> = [
    {
      name: 'GitHub',
      source: TokenSource.GITHUB,
      bold: 'Required',
      message: 'GitHub credentials are used for login purposes as well as for pulling source code from GitHub.',
      show: false
    },
    {
      name: 'Google',
      source: TokenSource.GOOGLE,
      bold: 'Required',
      message: 'Google credentials are used for login purposes and integration with FireCloud.',
      show: false
    },
    {
      name: 'Quay',
      source: TokenSource.QUAY,
      bold: 'Optional',
      message: 'Quay.io credentials are used for pulling information about Docker images and automated builds.',
      show: false
    },
    {
      name: 'Bitbucket',
      source: TokenSource.BITBUCKET,
      bold: 'Optional',
      message: 'Bitbucket credentials are used for pulling source code from Bitbucket.',
      show: false
    // },
    // {
    //   name: 'GitLab',
    //   source: TokenSource.GITLAB,
    //   bold: 'Optional',
    //   message: 'GitLab credentials are used for pulling source code from GitLab.',
    //   show: false
    }
  ];

  public tokens: Token[];
  private userId;
  private ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private trackLoginService: TrackLoginService, private tokenService: TokenService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private usersService: UsersService,
    private authService: AuthService, private configuration: Configuration, private accountsService: AccountsService) {
    this.trackLoginService.isLoggedIn$.takeUntil(this.ngUnsubscribe).subscribe(
      state => {
        if (!state) {
          this.router.navigate(['']);
        }
      }
    );
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

  link(source: string): void {
    this.accountsService.link(source);
  }

  // Delete a token and unlink service in the UI
  unlink(source: string) {
    this.deleteToken(source)
      .first().subscribe(() => {
        this.tokenService.updateTokens();
        this.unlinkToken(source);
      });
  }

  // Show linked services in the UI
  private setAvailableTokens(tokens) {
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
  private setTokens(tokens): void {
    this.tokens = tokens;
    if (tokens) {
      this.setAvailableTokens(tokens);
    }
  }

  ngOnInit() {
    this.tokenService.tokens$.subscribe((tokens: Token[]) => {
      this.setTokens(tokens);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

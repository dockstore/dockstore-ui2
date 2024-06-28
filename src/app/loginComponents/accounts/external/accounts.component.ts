/*
 *     Copyright 2022 OICR, UCSC
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
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../ng2-ui-auth/public_api';
import { Dockstore } from '../../../shared/dockstore.model';
import { TokenSource } from '../../../shared/enum/token-source.enum';
import { TokenQuery } from '../../../shared/state/token.query';
import { TokenService } from '../../../shared/state/token.service';
import { TrackLoginService } from '../../../shared/track-login.service';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';
import { TokenUser } from './../../../shared/openapi/model/tokenUser';
import { AccountsService } from './accounts.service';
import { LogoutService } from '../../../shared/logout.service';
import { RevokeTokenDialogComponent } from './revoke-token-dialog/revoke-token-dialog.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { accountInfo, bootstrap4largeModalSize } from '../../../shared/constants';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetTokenUsernamePipe } from './getTokenUsername.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../../../shared/snackbar.directive';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

export interface AccountInfo {
  name: string;
  source: TokenSource;
  bold: string;
  control: boolean;
  docker: boolean;
  research: boolean;
  message: string;
  show: boolean;
  logo: string;
  isLinked?: boolean;
  username?: string;
}

@Component({
  selector: 'app-accounts-external',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    NgIf,
    MatLegacyCardModule,
    MatBadgeModule,
    MatLegacyChipsModule,
    RouterLink,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    SnackbarDirective,
    ClipboardModule,
    MatIconModule,
    NgFor,
    AsyncPipe,
    GetTokenUsernamePipe,
  ],
})
export class AccountsExternalComponent implements OnInit, OnDestroy {
  public dsServerURI: any;
  public orcidId$: Observable<string>;
  public TokenSource = TokenSource;
  public username$: Observable<string>;
  Dockstore = Dockstore;
  accountsInfo: Array<AccountInfo> = accountInfo;

  public tokens: TokenUser[];
  private ngUnsubscribe: Subject<{}> = new Subject();
  public show: boolean;
  public dockstoreToken: string;
  public orcidRootUrl: string;

  constructor(
    private trackLoginService: TrackLoginService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private accountsService: AccountsService,
    private matSnackBar: MatSnackBar,
    private userQuery: UserQuery,
    private tokenQuery: TokenQuery,
    private logoutService: LogoutService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
      if (!state) {
        this.router.navigate(['']);
      }
    });
    this.dockstoreToken = this.getDockstoreToken();
    this.orcidRootUrl = this.accountsService.getRoot(Dockstore.ORCID_AUTH_URL);
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
        (error) => {
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
        (error) => {
          this.matSnackBar.open('Failed to unlink ' + source, 'Dismiss');
        }
      );
  }

  // Show linked services in the UI
  private setAvailableTokens(tokens: TokenUser[]) {
    for (const account of this.accountsInfo) {
      const found = tokens.find((token) => token.tokenSource === account.source);
      if (found) {
        account.isLinked = true;
      } else {
        account.isLinked = false;
      }
    }
  }

  // Set tokens and linked services
  private setTokens(tokens: TokenUser[]): void {
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
    this.tokenQuery.tokens$.subscribe((tokens: TokenUser[]) => {
      this.setTokens(tokens);
    });
    this.username$ = this.userQuery.username$;
    this.orcidId$ = this.userQuery.user$.pipe(map((user) => user.orcid));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  revokeToken() {
    let dialogRef = this.dialog.open(RevokeTokenDialogComponent, {
      width: bootstrap4largeModalSize,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.alertService.start('Revoking Dockstore token');
        this.deleteToken(TokenSource.DOCKSTORE).subscribe(
          () => {
            this.revokeTokenSuccess();
          },
          (error) => {
            this.revokeTokenFailure(error);
          }
        );
      }
    });
  }

  /**
   * When the user's Dockstore token is successfully revoked, the user gets logged out.
   *
   * @private
   * @memberof RevokeTokenDialogComponent
   */
  private revokeTokenSuccess(): void {
    this.logoutService.logout();
    this.alertService.detailedSuccess('Revoking Dockstore token succeeded');
  }

  /**
   * What happens when revoking the Dockstore token has failed.
   *
   * @private
   * @memberof RevokeTokenDialogComponent
   */
  private revokeTokenFailure(error: HttpErrorResponse): void {
    this.alertService.detailedError(error);
  }
}

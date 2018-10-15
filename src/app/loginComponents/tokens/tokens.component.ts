import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DockstoreService } from '../../shared/dockstore.service';
import { LogoutService } from '../../shared/logout.service';
import { TokenQuery } from '../../shared/state/token.query';
import { TokenService } from '../../shared/state/token.service';
import { TrackLoginService } from '../../shared/track-login.service';
import { Logout } from '../logout';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html'
})
export class TokensComponent extends Logout implements OnInit {
  user;
  tokens = [];
  sortColumn: string;
  sortReverse: boolean;

  constructor(private dockstoreService: DockstoreService,
              private tokenService: TokenService, private tokenQuery: TokenQuery,
              trackLoginService: TrackLoginService,
              logoutService: LogoutService,
              router: Router) {
    super(trackLoginService, logoutService, router);
  }
  ngOnInit() {
    this.tokenQuery.tokens$.subscribe(tokens => {
      this.tokens = tokens;
      if (tokens) {
        this.setProperty();
      }
    });
  }
  // Delete a token and unlink service in the UI
  deleteToken(id: number) {
    this.tokenService.deleteToken(id).subscribe(() => {

      const dockstoreToken = this.tokens.find(token => token.tokenSource === 'dockstore');
      this.tokens = this.tokens.filter(token => token.id !== id);
      this.setProperty();
      if (dockstoreToken.id === id) {
        this.logout();
      }

    });
  }

  setProperty() {
    const tokensRef = this.tokens;
    for (const token of tokensRef) {
      token.copyClass = false;
    }
  }

  tokenCopyClassSwitch(id: number) {
    const tokensRef = this.tokens;
    for (const token of tokensRef) {
      if (token.id !== id) {
        token.copyClass = false;
      }
    }
  }

  clickSortColumn(columnName) {
    if (this.sortColumn === columnName) {
      this.sortReverse = !this.sortReverse;
    } else  {
      this.sortColumn = columnName;
      this.sortReverse = false;
    }
  }
  convertSorting(): string {
    return this.sortReverse ? '-' + this.sortColumn : this.sortColumn;
  }
  getIconClass(columnName): string {
    return this.dockstoreService.getIconClass(columnName, this.sortColumn, this.sortReverse);
  }

}

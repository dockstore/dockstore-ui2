import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Logout } from '../logout';

import { TokenService } from '../token.service';
import { UserService } from '../user.service';
import { TrackLoginService } from '../../shared/track-login.service';
import { LogoutService } from '../../shared/logout.service';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html'
})
export class TokensComponent extends Logout implements OnInit {
  user;
  tokens;

  constructor(private tokenService: TokenService,
              private userService: UserService,
              trackLoginService: TrackLoginService,
              logoutService: LogoutService,
              router: Router) {
    super(trackLoginService, logoutService, router);
  }

  // Delete a token and unlink service in the UI
  deleteToken(id: number) {
    this.tokenService.deleteToken(id).subscribe(() => {

      const dockstoreToken = this.tokens.find(token => token.tokenSource === 'dockstore');
      this.tokens = this.tokens.filter(token => token.id !== id);
      if (dockstoreToken.id === id) {
        this.logout();
      }

    });
  }

  ngOnInit() {
    this.userService.getUser()
      .map(user => user.id)
      .flatMap(id => this.userService.getTokens(id))
      .subscribe(tokens => this.tokens = tokens);
  }

}

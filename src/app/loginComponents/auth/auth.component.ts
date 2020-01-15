import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { Base } from '../../shared/base';
import { Provider } from '../../shared/enum/provider.enum';
import { TokenService } from '../../shared/state/token.service';
import { UserService } from '../../shared/user/user.service';
import { AlertService } from '../../shared/alert/state/alert.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent extends Base implements OnInit {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    super();
  }

  private getQuayToken(fragment: string) {
    const accessTokenString = 'access_token=';

    const startIndex = fragment.indexOf(accessTokenString) + accessTokenString.length;
    const endIndex = fragment.indexOf('&');

    return fragment.substring(startIndex, endIndex);
  }

  private addToken() {
    const addQuayToken = this.activatedRoute.fragment.pipe(
      mergeMap(fragment => this.tokenService.registerToken(this.getQuayToken(fragment), Provider.QUAY))
    );

    const queryObservable = this.activatedRoute.queryParams;

    const addGitHubToken = queryObservable.pipe(mergeMap(query => this.tokenService.registerToken(query['code'], Provider.GITHUB)));

    const addGitLabToken = queryObservable.pipe(mergeMap(query => this.tokenService.registerToken(query['code'], Provider.GITLAB)));

    const addZenodoToken = queryObservable.pipe(mergeMap(query => this.tokenService.registerToken(query['code'], Provider.ZENODO)));

    const addBitbucketToken = queryObservable.pipe(mergeMap(query => this.tokenService.registerToken(query['code'], Provider.BITBUCKET)));

    return this.activatedRoute.params.pipe(
      mergeMap(params => {
        const provider: Provider = params['provider'];

        switch (provider) {
          case Provider.GITHUB:
            return addGitHubToken;
          case Provider.QUAY:
            return addQuayToken;
          case Provider.BITBUCKET:
            return addBitbucketToken;
          case Provider.GITLAB:
            return addGitLabToken;
          case Provider.ZENODO:
            return addZenodoToken;
          default: {
            console.log('Unknown provider: ' + provider);
            return observableOf(null);
          }
        }
      })
    );
  }

  ngOnInit() {
    const prevPage = localStorage.getItem('page');

    this.addToken()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        token => {
          this.userService.getUser();
          this.router.navigate([`${prevPage}`]);
        },
        error => {
          this.router.navigate([`${prevPage}`]);
          this.alertService.detailedSnackBarError(error);
        }
      );
  }
}

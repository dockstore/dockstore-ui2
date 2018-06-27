
import {of as observableOf,  Observable ,  SubscriptionLike as ISubscription } from 'rxjs';

import {mergeMap} from 'rxjs/operators';
import { Provider } from '../../shared/enum/provider.enum';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  tokenSubscription: ISubscription;

  constructor(private tokenService: TokenService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  private getQuayToken(fragment: string) {
    const accessTokenString = 'access_token=';

    const startIndex = fragment.indexOf(accessTokenString) + accessTokenString.length;
    const endIndex = fragment.indexOf('&');

    return fragment.substring(startIndex, endIndex);
  }

  private addToken() {

    const addQuayToken = this.activatedRoute.fragment.pipe(mergeMap(fragment =>
      this.tokenService.registerToken(this.getQuayToken(fragment), Provider.QUAY)));

    const queryObservable = this.activatedRoute.queryParams;

    const addGitHubToken = queryObservable.pipe(
          mergeMap(query => this.tokenService.registerToken(query['code'], Provider.GITHUB)));

    const addGitLabToken = queryObservable.pipe(
      mergeMap(query => this.tokenService.registerToken(query['code'], Provider.GITLAB)));

    const addBitbucketToken = queryObservable.pipe(mergeMap(query =>
      this.tokenService.registerToken(query['code'], Provider.BITBUCKET)));

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
          default: {
            console.log('Unknown provider: ' + provider);
            return observableOf(null);
          }
        }
      }));
  }

  ngOnInit() {
    const prevPage = localStorage.getItem('page');

    this.tokenSubscription = this.addToken().subscribe(token => {
      if (token) {
        this.tokenService.updateTokens();
      }
      this.router.navigate([`${ prevPage }`]);
    }, error => {
      this.router.navigate([`${ prevPage }`]);
    });
  }

  ngOnDestroy() {
    this.tokenSubscription.unsubscribe();
  }

}

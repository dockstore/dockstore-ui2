import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ISubscription } from "rxjs/Subscription";

import { TokenService } from '../token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;

  constructor(private tokenService: TokenService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  private getQuayToken(fragment: string) {
    const accessTokenString = 'access_token=';

    const startIndex = fragment.indexOf(accessTokenString) + accessTokenString.length;
    const endIndex = fragment.indexOf('&');

    return fragment.substring(startIndex, endIndex);
  }

  private getCode() {
    return '';
  }

  private getToken(provider: string) {
    switch (provider) {
      case 'bitbucket':
        this.getQuayToken('');
        break;
      default:
        this.getCode();
    }
  }

  private addToken() {

    const addQuayToken = this.activatedRoute.fragment.flatMap(fragment =>
      this.tokenService.registerToken(this.getQuayToken(fragment), 'quay.io'));

    const queryObservable = this.activatedRoute.queryParams;

    const addGitLabToken = queryObservable
      .flatMap(query => this.tokenService.registerToken(query['code'], 'gitlab.com'));

    const addBitbucketToken = queryObservable.flatMap(query =>
      this.tokenService.registerToken(query['code'], 'bitbucket.org'));

    return this.activatedRoute.params
      .flatMap(params => {
        const provider = params['provider'];

        switch (provider) {
          case 'quay.io':
            return addQuayToken;
          case 'bitbucket':
            return addBitbucketToken;
          case 'gitlab':
            return addGitLabToken;
        }
      });
  }

  ngOnInit() {
    this.subscription = this.addToken().subscribe(res => console.log('Token Linked'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

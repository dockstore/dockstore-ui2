import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/shared/user/user.service';
import { of as observableOf } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { Base } from '../../shared/base';
import { Provider } from '../../shared/enum/provider.enum';
import { TokenService } from '../../shared/state/token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent extends Base implements OnInit {
  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
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
      mergeMap((fragment) => this.tokenService.registerToken(this.getQuayToken(fragment), Provider.QUAY))
    );

    const queryObservable = this.activatedRoute.queryParams;

    const addGitHubToken = queryObservable.pipe(mergeMap((query) => this.tokenService.registerToken(query['code'], Provider.GITHUB)));

    const addGitLabToken = queryObservable.pipe(mergeMap((query) => this.tokenService.registerToken(query['code'], Provider.GITLAB)));

    const addZenodoToken = queryObservable.pipe(mergeMap((query) => this.tokenService.registerToken(query['code'], Provider.ZENODO)));

    const addBitbucketToken = queryObservable.pipe(mergeMap((query) => this.tokenService.registerToken(query['code'], Provider.BITBUCKET)));

    const addOrcidToken = queryObservable.pipe(mergeMap((query) => this.tokenService.registerToken(query['code'], Provider.ORCID)));

    return this.activatedRoute.params.pipe(
      mergeMap((params) => {
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
          case Provider.ORCID:
            return addOrcidToken;
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
    const provider: Provider = this.activatedRoute.snapshot.params['provider'];
    this.addToken()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (token) => {
          if (provider === Provider.ORCID) {
            // This component should only exist inside a temporary window used in the OAuth process
            window.close();
          } else {
            this.userService.getUser();
            this.router.navigate([`${prevPage}`]);
          }
        },
        (error) => {
          if (provider !== Provider.ORCID) {
            this.router.navigate([`${prevPage}`]);
          }
          if (error.status === 409) {
            this.alertService.detailedSnackBarErrorWithLink(
              error,
              'Docs',
              'https://docs.dockstore.org/en/latest/faq.html#what-is-the-difference-between-logging-in-with-github-or-logging-in-with-google'
            );
          } else {
            this.alertService.detailedSnackBarError(error);
          }
        }
      );
  }
}

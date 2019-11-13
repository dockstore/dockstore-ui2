import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { AlertService } from './shared/alert/state/alert.service';
import { Dockstore } from './shared/dockstore.model';
import { TrackLoginService } from './shared/track-login.service';
import { TosBannerQuery } from './tosBanner/state/tos-banner.query';
import { User } from './shared/openapi/model/user';
import { currentTOSVersion, currentPrivacyPolicyVersion } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn$: Observable<boolean>;
  public dismissedTOS$: Observable<boolean>;
  public dismissedLatestTOS$: Observable<User.TosversionEnum>;
  public dismissedLatestPrivacyPolicy$: Observable<User.PrivacyPolicyVersionEnum>;
  public currentTOSVersion: User.TosversionEnum = currentTOSVersion;
  public currentPrivacyPolicyVersion: User.PrivacyPolicyVersionEnum = currentPrivacyPolicyVersion;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private alertService: AlertService,
    private trackLoginService: TrackLoginService,
    private tosBannerQuery: TosBannerQuery
  ) {
    this.injectGoogleTagManagerScript();
  }

  private unsubscribe = new Subject<void>();

  ngOnInit() {
    this.isLoggedIn$ = this.trackLoginService.isLoggedIn$;
    this.dismissedTOS$ = this.tosBannerQuery.dismissedTOS$;
    this.dismissedLatestTOS$ = this.tosBannerQuery.dismissedLatestTOS$;
    this.dismissedLatestPrivacyPolicy$ = this.tosBannerQuery.dismissedLatestPrivacyPolicy$;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data)
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(event => {
        this.titleService.setTitle(event['title']);
        this.alertService.clearEverything();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * This injects the google tag manager script into the index.html HEAD.
   * Injecting it is slower than having it in the HTML, but because the Google Tag Manager ID changes,
   * we would've needed multiple index.html and multiple builds.
   * The initial page load time will always be inaccurate but we have lighthouse to check that.
   * @private
   * @memberof AppComponent
   */
  private injectGoogleTagManagerScript() {
    const googleTagManagerId = Dockstore.GOOGLE_TAG_MANAGER_ID;
    const script = document.createElement('script');
    script.innerHTML = `(function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', '${googleTagManagerId}')`;
    document.head.appendChild(script);
  }
}

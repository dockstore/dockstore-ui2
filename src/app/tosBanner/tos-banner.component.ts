import { Component, OnInit } from '@angular/core';
import { TosBannerService } from './state/tos-banner.service';
import { Observable } from 'rxjs';
import { TosBannerQuery } from './state/tos-banner.query';
import { TrackLoginService } from '../shared/track-login.service';

@Component({
  selector: 'app-tos-banner',
  templateUrl: './tos-banner.component.html'
})
export class TosBannerComponent implements OnInit {
  public isLoggedIn$: Observable<boolean>;
  public dismissedTOS$: Observable<boolean>;
  constructor(
    private tosBannerService: TosBannerService,
    private tosBannerQuery: TosBannerQuery,
    private trackLoginService: TrackLoginService
  ) {}

  ngOnInit(): void {
    this.dismissedTOS$ = this.tosBannerQuery.dismissedTOS$;
    this.isLoggedIn$ = this.trackLoginService.isLoggedIn$;
    // if (!this.dismissedTOS$) {
    //   localStorage.setItem('dismissedTOS', 'false');
    //   this.dismissedTOS$ = this.tosBannerQuery.dismissedTOS$;
    // }
  }

  dismissTOS(): void {
    this.tosBannerService.dismissTOS();
  }
}

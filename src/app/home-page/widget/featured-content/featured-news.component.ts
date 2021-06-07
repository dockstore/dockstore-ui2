import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'app-featured-news',
  template: ` <div [innerHTML]="myExternalHTML"></div> `,
})
export class FeaturedNewsComponent implements OnInit {
  // TODO should parameterize FeaturedContentComponent or something
  public myExternalHTML = '';

  constructor(private http: HttpClient, private alertService: AlertService) {}
  ngOnInit() {
    this.alertService.start('Retrieving featured news');
    this.http
      .get(
        Dockstore.FEATURED_NEWS_URL,
        // set authorization header to empty, prevents ng2-ui interceptor from adding dockstore bearer token
        { headers: { Authorization: '' }, responseType: 'text' }
      )
      .subscribe(
        (data) => {
          this.myExternalHTML = data;
          this.alertService.simpleSuccess();
        },
        () => {
          this.alertService.simpleError();
        }
      );
  }
}

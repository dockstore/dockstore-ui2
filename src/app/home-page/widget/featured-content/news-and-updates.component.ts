import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'app-news-and-updates',
  template: ` <span [innerHTML]="myExternalHTML"></span> `,
  styleUrls: ['../../../shared/styles/dashboard-boxes.scss'],
})
export class NewsAndUpdatesComponent {
  // TODO should parameterize FeaturedContentComponent or something
  public myExternalHTML = '';
  public newsEntriesCount: number = 0;

  constructor(private http: HttpClient, private alertService: AlertService) {
    this.alertService.start('Retrieving news and updates');
    this.http
      .get(
        Dockstore.FEATURED_NEWS_URL,
        // set authorization header to empty, prevents ng2-ui interceptor from adding dockstore bearer token
        { headers: { Authorization: '' }, responseType: 'text' }
      )
      .subscribe(
        (data) => {
          this.myExternalHTML = data;
          // Count the number of "news-entry" classes to indicate the number of news entries
          this.newsEntriesCount = (this.myExternalHTML.match(/news-entry/g) || []).length;
          this.alertService.simpleSuccess();
        },
        () => {
          this.alertService.simpleError();
        }
      );
  }
}

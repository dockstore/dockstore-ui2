import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../../../shared/dockstore.model';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'featured-content',
  template: `
    <div [innerHTML]="myExternalHTML"></div>
  `
})
export class FeaturedContentComponent implements OnInit {
  public myExternalHTML: any = '';

  constructor(private http: HttpClient, private alertService: AlertService) {}
  ngOnInit() {
    this.alertService.start('Retrieve featured content');
    this.http
      .get(
        Dockstore.FEATURED_CONTENT_URL,
        // set authorization header to empty, prevents ng2-ui interceptor from adding dockstore bearer token
        { headers: { Authorization: '' }, responseType: 'text' }
      )
      .subscribe(
        data => {
          this.myExternalHTML = data;
          this.alertService.simpleSuccess();
        },
        () => {
          this.alertService.simpleError();
        }
      );
  }
}

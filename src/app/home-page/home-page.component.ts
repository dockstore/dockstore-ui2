import { Component, OnInit } from '@angular/core';
import { devMode } from 'app/shared/constants';
import { User } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { HomePageService } from './home-page.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  devMode = devMode;
  public user$: Observable<User>;
  public orgSchema;
  public websiteSchema;
  constructor(private userQuery: UserQuery, private homePageService: HomePageService) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
    this.orgSchema = this.homePageService.hpOrgSchema;
    this.websiteSchema = this.homePageService.hpWebsiteSchema;
  }
}

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
  public hpOrgSchema;
  public hpWebsiteSchema;
  constructor(private userQuery: UserQuery, private hpService: HomePageService) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
    this.hpOrgSchema = this.hpService.hpOrgSchema;
    this.hpWebsiteSchema = this.hpService.hpWebsiteSchema;
  }
}

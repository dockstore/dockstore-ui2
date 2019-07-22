import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/swagger';
import { UserQuery } from '../shared/user/user.query';

@Component({
  selector: 'app-logged-in-banner',
  templateUrl: './logged-in-banner.component.html',
  styleUrls: ['./logged-in-banner.component.scss']
})
export class LoggedInBannerComponent implements OnInit {
  constructor(private userQuery: UserQuery) {}
  public user$: Observable<User>;

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }
}

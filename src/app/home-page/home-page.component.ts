import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  public user$: Observable<User>;
  constructor(private userQuery: UserQuery) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }
}

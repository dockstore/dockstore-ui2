import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/swagger/model/user';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss']
})
export class HomeLoggedInComponent implements OnInit {
  public user$: Observable<User>;

  constructor(private userQuery: UserQuery) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }
}

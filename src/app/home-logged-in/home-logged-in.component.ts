import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../shared/swagger/model/user';
import { UserQuery } from '../shared/user/user.query';

@Component({
  selector: 'home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss']
})
export class HomeLoggedInComponent implements OnInit {
  public user$: Observable<User>;

  constructor(private userQuery: UserQuery, private router: Router) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }

  goToSearch(searchValue: string) {
    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }
}

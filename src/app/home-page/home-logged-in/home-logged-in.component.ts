import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/swagger/model/user';
import { UserQuery } from '../../shared/user/user.query';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss']
})
export class HomeLoggedInComponent implements OnInit, OnDestroy {
  public user$: Observable<User>;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private userQuery: UserQuery, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

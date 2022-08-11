import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { TwitterService } from 'app/shared/twitter.service';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../shared/swagger/model/user';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss'],
})
export class HomeLoggedInComponent extends Base implements OnInit, AfterViewInit {
  public user$: Observable<User>;
  Dockstore = Dockstore;
  @ViewChild('twitter') twitterElement: ElementRef;

  constructor(private userQuery: UserQuery, private twitterService: TwitterService) {
    super();
  }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }

  ngAfterViewInit() {
    this.loadTwitterWidget();
  }

  loadTwitterWidget() {
    this.twitterService
      .loadScript()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.twitterService.createTimeline(this.twitterElement, 3);
        },
        (err) => console.error(err)
      );
  }
}

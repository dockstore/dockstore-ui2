import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';

import { User } from '../shared/swagger/model/user';
import { TwitterService } from '../shared/twitter.service';
import { UserQuery } from '../shared/user/user.query';
import { Subject, Observable } from 'rxjs';

@Component({
  template: '<iframe id="youtubeModal" width="560" height="315" src="https://www.youtube.com/embed/RYHUX9jGx24" frameborder="0"></iframe>'
})
export class YoutubeComponent {
  constructor(public dialogRef: MatDialogRef<YoutubeComponent>) {}
}

@Component({
  selector: 'home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss']
})
export class HomeLoggedInComponent implements OnInit, AfterViewInit {
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  public user$: Observable<User>;
  public selectedTab = 'toolTab';
  protected ngUnsubscribe: Subject<{}> = new Subject();

  @ViewChild('youtube') youtube: ElementRef;

  constructor(private dialog: MatDialog, private twitterService: TwitterService, private userQuery: UserQuery, private router: Router) {}

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }
  ngAfterViewInit() {
    this.twitterService.runScript();
  }

  goToSearch(searchValue: string) {
    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }

  onSelect(data: TabDirective): void {
    this.selectedTab = data.id;
  }

  openYoutube() {
    this.dialog.open(YoutubeComponent);
  }

  // Router link will not scroll to top of page on change, this fixes that
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}

/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionService } from 'app/shared/session/session.service';
import { User } from 'app/shared/swagger';
import { TwitterService } from 'app/shared/twitter.service';
import { UserQuery } from 'app/shared/user/user.query';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Observable } from 'rxjs';
import { Dockstore } from '../../shared/dockstore.model';

/**
 * Simple youtube iframe component, too simple to have its own file
 *
 * @export
 * @class YoutubeComponent
 */
@Component({
  template: '<iframe id="youtubeModal" width="560" height="315" src="https://www.youtube.com/embed/RYHUX9jGx24" frameborder="0"></iframe>'
})
export class YoutubeComponent {
  constructor(public dialogRef: MatDialogRef<YoutubeComponent>) {}
}

@Component({
  selector: 'old-app-home',
  templateUrl: './old-home-page.component.html',
  styleUrls: ['./old-home-page.component.scss']
})
export class OldHomePageComponent implements OnInit, AfterViewInit {
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  public user$: Observable<User>;
  public selectedTab = 'toolTab';
  Dockstore = Dockstore;

  @ViewChild('youtube', { static: false }) youtube: ElementRef;

  constructor(
    private dialog: MatDialog,
    private twitterService: TwitterService,
    private userQuery: UserQuery,
    private router: Router,
    private sessionService: SessionService
  ) {}

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
    this.sessionService.setEntryType(EntryType.BioWorkflow);
    this.selectedTab = data.id;
  }

  openYoutube() {
    this.dialog.open(YoutubeComponent);
  }
}

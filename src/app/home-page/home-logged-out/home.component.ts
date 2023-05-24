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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HomePageService } from 'app/home-page/home-page.service';
import { Base } from 'app/shared/base';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dockstore } from '../../shared/dockstore.model';
import { User } from '../../shared/swagger/model/user';
import { TwitterService } from '../../shared/twitter.service';
import { UserQuery } from '../../shared/user/user.query';
import { Category } from '../../shared/openapi';
import { AllCategoriesService } from '../../categories/state/all-categories.service';

/**
 * Simple youtube iframe component, too simple to have its own file
 *
 * @export
 * @class YoutubeComponent
 */
@Component({
  template: '<iframe id="youtubeModal" width="560" height="315" src="https://www.youtube.com/embed/RYHUX9jGx24" frameborder="0"></iframe>',
})
export class YoutubeComponent {
  constructor(public dialogRef: MatDialogRef<YoutubeComponent>) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends Base implements OnInit, AfterViewInit {
  faGithub = faGithub;
  faGoogle = faGoogle;
  public user$: Observable<User>;
  Dockstore = Dockstore;
  public toolCategories$: Observable<Array<Category>>;
  public workflowCategories$: Observable<Array<Category>>;
  public orgSchema;
  public websiteSchema;

  @ViewChild('twitter') twitterElement: ElementRef;

  @ViewChild('youtube') youtube: ElementRef;

  constructor(
    private dialog: MatDialog,
    private twitterService: TwitterService,
    private userQuery: UserQuery,
    private homePageService: HomePageService,
    private allCategoriesService: AllCategoriesService
  ) {
    super();
  }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
    this.allCategoriesService.updateAllCategories();
    this.toolCategories$ = this.allCategoriesService.toolCategories$;
    this.workflowCategories$ = this.allCategoriesService.workflowCategories$;
    this.orgSchema = this.homePageService.hpOrgSchema;
    this.websiteSchema = this.homePageService.hpWebsiteSchema;
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
          this.twitterService.createTimeline(this.twitterElement, 2);
        },
        (err) => console.error(err)
      );
  }

  goToSearch(searchValue: string) {
    this.homePageService.goToSearch(searchValue);
  }

  openYoutube() {
    this.dialog.open(YoutubeComponent);
  }
}

/*
 *    Copyright 2023 OICR
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
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HomePageService } from 'app/home-page/home-page.service';
import { Base } from 'app/shared/base';
import { Observable } from 'rxjs';
import { Dockstore } from '../../shared/dockstore.model';
import { User } from '../../shared/openapi/model/user';
import { UserQuery } from '../../shared/user/user.query';
import { Category } from '../../shared/openapi';
import { AllCategoriesService } from '../../categories/state/all-categories.service';
import { MastodonComponent } from '../../shared/mastodon/mastodon.component';
import { MatDividerModule } from '@angular/material/divider';
import { NewsAndUpdatesComponent } from '../widget/featured-content/news-and-updates.component';
import { FeaturedContentComponent } from '../widget/featured-content/featured-content.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { CategoryButtonComponent } from '../../categories/button/category-button.component';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { NgIf, NgFor, AsyncPipe, SlicePipe } from '@angular/common';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { RouterLink } from '@angular/router';
import { JsonLdComponent } from '../../shared/json-ld/json-ld.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

/**
 * Simple youtube iframe component, too simple to have its own file
 *
 * @export
 * @class YoutubeComponent
 */
@Component({
  template: '<iframe id="youtubeModal" width="560" height="315" src="https://www.youtube.com/embed/RYHUX9jGx24" frameborder="0"></iframe>',
  standalone: true,
})
export class YoutubeComponent {
  constructor(public dialogRef: MatDialogRef<YoutubeComponent>) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    JsonLdComponent,
    RouterLink,
    MatLegacyButtonModule,
    MatIconModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    NgIf,
    MatLegacyChipsModule,
    NgFor,
    CategoryButtonComponent,
    MatLegacyTabsModule,
    ExtendedModule,
    FontAwesomeModule,
    FeaturedContentComponent,
    NewsAndUpdatesComponent,
    MatDividerModule,
    MastodonComponent,
    AsyncPipe,
    SlicePipe,
  ],
})
export class HomeComponent extends Base implements OnInit {
  faGithub = faGithub;
  faGoogle = faGoogle;
  public user$: Observable<User>;
  Dockstore = Dockstore;
  public toolCategories$: Observable<Array<Category>>;
  public workflowCategories$: Observable<Array<Category>>;
  public orgSchema;
  public websiteSchema;

  @ViewChild('youtube') youtube: ElementRef;

  constructor(
    private dialog: MatDialog,
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

  goToSearch(searchValue: string) {
    this.homePageService.goToSearch(searchValue);
  }

  openYoutube() {
    this.dialog.open(YoutubeComponent);
  }
}

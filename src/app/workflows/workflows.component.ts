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

import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { Observable } from 'rxjs';
import { EntryType } from '../shared/enum/entry-type';
import { EntryTypeMetadata } from 'app/shared/openapi';
import { UrlResolverService } from '../shared/url-resolver.service';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  standalone: true,
  imports: [HeaderComponent, NgIf, FlexModule, RouterLink, ExtendedModule, RouterOutlet, AsyncPipe, TitleCasePipe],
})
export class WorkflowsComponent {
  public entryName: string;
  public entryPageTitle$: Observable<string>;
  public entryType$: Observable<EntryType>;
  public entryTypeMetadata$: Observable<EntryTypeMetadata>;
  EntryType = EntryType;
  private searchPageUrls: string[] = ['/workflows', '/notebooks', '/apptools', '/services'];
  public searchPage: boolean = false;

  constructor(
    private sessionQuery: SessionQuery,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
    private urlResolverService: UrlResolverService
  ) {
    /* Force refresh of route when nagivating from /entryType to /entryType/entryName to update header */
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.sessionService.setEntryType(this.route.snapshot.data['entryType']);
    this.entryPageTitle$ = this.sessionQuery.entryPageTitle$;
    this.entryType$ = this.sessionQuery.entryType$;
    this.entryTypeMetadata$ = this.sessionQuery.entryTypeMetadata$;
    this.searchPage = this.searchPageUrls.includes(this.urlResolverService.getEntryPathFromUrl());
    this.entryName = this.urlResolverService.getEntryPathFromUrl();
  }
}

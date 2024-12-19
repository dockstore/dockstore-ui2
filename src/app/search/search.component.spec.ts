/*
 *    Copyright 2019 OICR
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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtendedGA4GHService } from 'app/shared/openapi';
import { of } from 'rxjs';
import { DateService } from '../shared/date.service';
import { ProviderService } from '../shared/provider.service';
import {
  DateStubService,
  ExtendedGA4GHStubService,
  ProviderStubService,
  QueryBuilderStubService,
  SearchStubService,
} from './../test/service-stubs';
import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';
import { QueryBuilderService } from './query-builder.service';
import { SearchComponent } from './search.component';
import { SearchQuery } from './state/search.query';
import { SearchService } from './state/search.service';

@Component({
  selector: 'app-search-results',
  template: '',
  standalone: true,
  imports: [ClipboardModule, FontAwesomeModule, RouterTestingModule, MatSnackBarModule],
})
class SearchResultsComponent {}

@Component({
  selector: 'app-basic-search',
  template: '',
  standalone: true,
  imports: [ClipboardModule, FontAwesomeModule, RouterTestingModule, MatSnackBarModule],
})
class BasicSearchComponent {}

@Component({
  selector: 'app-header',
  template: '',
  standalone: true,
  imports: [ClipboardModule, FontAwesomeModule, RouterTestingModule, MatSnackBarModule],
})
class HeaderComponent {}

/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
describe('SearchComponent', () => {
  let component: SearchComponent;
  let searchQuery: jasmine.SpyObj<SearchQuery>;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          ClipboardModule,
          FontAwesomeModule,
          RouterTestingModule,
          MatSnackBarModule,
          MatDialogModule,
          SearchComponent,
          MapFriendlyValuesPipe,
          HeaderComponent,
          BasicSearchComponent,
          SearchResultsComponent,
        ],
        providers: [
          { provide: SearchService, useClass: SearchStubService },
          { provide: QueryBuilderService, useClass: QueryBuilderStubService },
          { provide: ProviderService, useClass: ProviderStubService },
          { provide: ExtendedGA4GHService, useClass: ExtendedGA4GHStubService },
          { provide: SearchQuery, useValue: jasmine.createSpyObj('SearchQuery', ['select', 'getValue', 'searchText']) },
          { provide: DateService, useClass: DateStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchQuery = TestBed.inject(SearchQuery) as jasmine.SpyObj<SearchQuery>;
    searchQuery.searchText$ = of('');
    searchQuery.getValue.and.returnValue({
      shortUrl: null,
      workflowhit: null,
      toolhit: null,
      notebookhit: null,
      showToolTagCloud: false,
      showWorkflowTagCloud: false,
      showNotebookTagCloud: false,
      searchText: '',
      filterKeys: [],
      autocompleteTerms: [],
      facetAutocompleteTerms: [],
      suggestTerm: '',
      pageSize: 10,
      pageIndex: 0,
      advancedSearch: null,
      currentTabIndex: 0,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

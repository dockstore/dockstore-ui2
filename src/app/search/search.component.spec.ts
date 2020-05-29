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
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopoverModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { of } from 'rxjs';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { ProviderService } from '../shared/provider.service';
import { ProviderStubService, QueryBuilderStubService, SearchStubService } from './../test/service-stubs';
import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';
import { QueryBuilderService } from './query-builder.service';
import { SearchComponent } from './search.component';
import { SearchQuery } from './state/search.query';
import { SearchService } from './state/search.service';
import { MdePopoverModule } from '@material-extended/mde';

@Component({
  selector: 'app-search-results',
  template: ''
})
class SearchResultsComponent {}

@Component({
  selector: 'app-basic-search',
  template: ''
})
class BasicSearchComponent {}

@Component({
  selector: 'app-header',
  template: ''
})
class HeaderComponent {}

/* tslint:disable:no-unused-variable */
describe('SearchComponent', () => {
  let component: SearchComponent;
  let searchQuery: jasmine.SpyObj<SearchQuery>;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent, MapFriendlyValuesPipe, HeaderComponent, BasicSearchComponent, SearchResultsComponent],
      imports: [CustomMaterialModule, ClipboardModule, PopoverModule.forRoot(), FontAwesomeModule, RouterTestingModule, MdePopoverModule],
      providers: [
        { provide: SearchService, useClass: SearchStubService },
        { provide: QueryBuilderService, useClass: QueryBuilderStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: SearchQuery, useValue: jasmine.createSpyObj('SearchQuery', ['select', 'getValue', 'searchText']) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchQuery = TestBed.get(SearchQuery);
    searchQuery.searchText$ = of('');
    searchQuery.getValue.and.returnValue({
      shortUrl: null,
      workflowhit: null,
      toolhit: null,
      showToolTagCloud: false,
      showWorkflowTagCloud: false,
      searchText: '',
      filterKeys: [],
      autocompleteTerms: [],
      suggestTerm: '',
      pageSize: 10,
      pageIndex: 0,
      advancedSearch: null,
      currentTabIndex: 0
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

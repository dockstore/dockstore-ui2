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
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccordionModule } from 'ngx-bootstrap';

import { ProviderService } from '../shared/provider.service';
import { AdvancedSearchStubService, QueryBuilderStubService, SearchStubService } from './../test/service-stubs';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { ExpandService } from './expand.service';
import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';
import { QueryBuilderService } from './query-builder.service';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

/* tslint:disable:no-unused-variable */
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent, MapFriendlyValuesPipe ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, AccordionModule.forRoot(), HttpClientModule],
      providers: [
        {provide: SearchService, useClass: SearchStubService},
        { provide: QueryBuilderService, useClass: QueryBuilderStubService },
        ProviderService,
        { provide: AdvancedSearchService, useClass: AdvancedSearchStubService},
        ExpandService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

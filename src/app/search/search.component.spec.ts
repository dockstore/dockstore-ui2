import { ExpandService } from './expand.service';
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

import { AccordionModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { ProviderService } from '../shared/provider.service';
import { QueryBuilderStubService, SearchStubService, AdvancedSearchStubService } from './../test/service-stubs';
import { QueryBuilderService } from './query-builder.service';
import { SearchService } from './search.service';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
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

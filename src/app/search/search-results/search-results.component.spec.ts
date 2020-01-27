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

import { QueryBuilderService } from './../query-builder.service';
import { SearchStubService, QueryBuilderStubService } from './../../test/service-stubs';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { TabsModule } from 'ngx-bootstrap/tabs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchResultsComponent } from './search-results.component';
import { SearchService } from '../state/search.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TabsModule.forRoot(), TagCloudModule, RouterTestingModule],
      providers: [
        { provide: SearchService, useClass: SearchStubService },
        { provide: QueryBuilderService, useClass: QueryBuilderStubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

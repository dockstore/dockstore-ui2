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

import { ListContainersService } from './../containers/list/list.service';
import { SearchStubService, ListContainersStubService } from './../test/service-stubs';
import { SearchService } from './../search/search.service';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterLinkStubDirective } from './../test/router-stubs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DockstoreService } from '../shared/dockstore.service';

import { ListentryComponent } from './listentry.component';

describe('ListentryComponent', () => {
  let component: ListentryComponent;
  let fixture: ComponentFixture<ListentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListentryComponent,
      RouterLinkStubDirective ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ DataTablesModule.forRoot(), ClipboardModule ],
      providers: [
        { provide: SearchService, useClass: SearchStubService },
        { provide: ListContainersService, useClass: ListContainersStubService },
        { provide: DockstoreService, useClass: SearchStubService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

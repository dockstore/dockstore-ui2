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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutService } from '../shared/logout.service';
import { PageInfo } from '../shared/models/PageInfo';
import { PagenumberService } from '../shared/pagenumber.service';
import { TrackLoginService } from '../shared/track-login.service';
import { LogoutStubService, TrackLoginStubService } from '../test/service-stubs';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let pagenumberService: PagenumberService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatToolbarModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PagenumberService,
        { provide: TrackLoginService, useClass: TrackLoginStubService },
        { provide: LogoutService, useClass: LogoutStubService }
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    pagenumberService = fixture.debugElement.injector.get(PagenumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    component.resetPageNumber();
    fixture.detectChanges();
    const toolPageInfo: PageInfo = new PageInfo();
    toolPageInfo.pgNumber = 0;
    toolPageInfo.searchQuery = '';
    pagenumberService.pgNumTools$.subscribe(pgNumTools => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
    pagenumberService.pgNumWorkflows$.subscribe(pgNumTools => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
  });
});

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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestsService } from '../loginComponents/state/requests.service';
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
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          MatMenuModule,
          MatSnackBarModule,
          MatButtonModule,
          MatIconModule,
          MatDividerModule,
          MatToolbarModule,
          HttpClientTestingModule,
          NavbarComponent,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          PagenumberService,
          { provide: TrackLoginService, useClass: TrackLoginStubService },
          { provide: LogoutService, useClass: LogoutStubService },
          RequestsService,
        ],
      }).compileComponents();
    })
  );
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
    pagenumberService.pgNumTools$.subscribe((pgNumTools) => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
    pagenumberService.pgNumWorkflows$.subscribe((pgNumTools) => {
      expect(pgNumTools).toEqual(toolPageInfo);
    });
  });
});

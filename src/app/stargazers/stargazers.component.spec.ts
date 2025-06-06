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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StarentryService } from '../shared/starentry.service';
import { UserService } from '../shared/user/user.service';
import { StarringService } from '../starring/starring.service';
import { StarEntryStubService, StarringStubService, UserStubService } from '../test/service-stubs';
import { StargazersComponent } from './stargazers.component';

describe('StargazersComponent', () => {
  let component: StargazersComponent;
  let fixture: ComponentFixture<StargazersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconModule, MatCardModule, StargazersComponent],
        providers: [
          { provide: UserService, useClass: UserStubService },
          { provide: StarringService, useClass: StarringStubService },
          { provide: StarentryService, useClass: StarEntryStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StargazersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

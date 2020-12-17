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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { StarOrganizationService } from '../../../shared/star-organization.service';
import { UserService } from '../../../shared/user/user.service';
import { OrganizationStarringStubService, StarOrganizationStubService, UserStubService } from '../../../test/service-stubs';
import { OrganizationStarringService } from '../organization-starring/organization-starring.service';
import { OrganizationStargazersComponent } from './organization-stargazers.component';

describe('OrganizationStargazersComponent', () => {
  let component: OrganizationStargazersComponent;
  let fixture: ComponentFixture<OrganizationStargazersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationStargazersComponent],
      imports: [MatIconModule, MatCardModule],
      providers: [
        { provide: UserService, useClass: UserStubService },
        { provide: OrganizationStarringService, useClass: OrganizationStarringStubService },
        { provide: StarOrganizationService, useClass: StarOrganizationStubService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationStargazersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

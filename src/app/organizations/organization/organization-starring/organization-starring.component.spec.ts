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

import { OrganizationStarringComponent } from './organization-starring.component';
import { MatIconModule, MatSnackBarModule } from '@angular/material';
import { TrackLoginService } from '../../../shared/track-login.service';
import {
  ContainerStubService,
  OrganizationStarringStubService,
  StarEntryStubService,
  StarOrganizationStubService,
  StarringStubService,
  TrackLoginStubService
} from '../../../test/service-stubs';
import { OrganizationStarringService } from './organization-starring.service';
import { StarentryService } from '../../../shared/starentry.service';
import { ContainerService } from '../../../shared/container.service';
import { StarringService } from '../../../starring/starring.service';
import { StarOrganizationService } from '../../../shared/star-organization.service';

describe('OrganizationStarringComponent', () => {
  let component: OrganizationStarringComponent;
  let fixture: ComponentFixture<OrganizationStarringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatSnackBarModule],
      declarations: [OrganizationStarringComponent],
      providers: [
        { provide: TrackLoginService, useClass: TrackLoginStubService },
        { provide: OrganizationStarringService, useClass: OrganizationStarringStubService },
        { provide: StarentryService, useClass: StarEntryStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: StarringService, useClass: StarringStubService },
        { provide: StarOrganizationService, useClass: StarOrganizationStubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationStarringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { RefreshService } from '../../shared/refresh.service';
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStubService } from '../../test/service-stubs';
import { UserService } from './../../loginComponents/user.service';
import { ContainerService } from './../../shared/container.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { ContainerStubService, UsersStubService, RefreshStubService } from './../../test/service-stubs';
import { RefreshToolOrganizationComponent } from './refresh-tool-organization.component';
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';
/* tslint:disable:no-unused-variable */
describe('RefreshToolOrganizationComponent', () => {
  let component: RefreshToolOrganizationComponent;
  let fixture: ComponentFixture<RefreshToolOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefreshToolOrganizationComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
      ],
      providers: [
        { provide: UserService, useClass: UserStubService },
        { provide: UsersService, useClass: UsersStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: RefreshService, useClass: RefreshStubService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshToolOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

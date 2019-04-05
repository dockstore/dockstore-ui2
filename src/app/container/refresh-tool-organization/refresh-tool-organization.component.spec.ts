import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';

import { RefreshService } from '../../shared/refresh.service';
import { ContainerService } from './../../shared/container.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { ContainerStubService, RefreshStubService, UsersStubService } from './../../test/service-stubs';
import { RefreshToolOrganizationComponent } from './refresh-tool-organization.component';

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

describe('RefreshToolOrganizationComponent', () => {
  let component: RefreshToolOrganizationComponent;
  let fixture: ComponentFixture<RefreshToolOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefreshToolOrganizationComponent],
      imports: [
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
      ],
      providers: [
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

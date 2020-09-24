import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExtendedDockstoreToolService } from 'app/shared/extended-dockstoreTool/extended-dockstoreTool.service';
import { ProviderService } from 'app/shared/provider.service';
import { ContainersService } from 'app/shared/swagger';
import { RefreshService } from '../../shared/refresh.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import {
  ContainersStubService,
  ExtendedDockstoreToolStubService,
  ProviderStubService,
  RefreshStubService,
  UsersStubService,
} from './../../test/service-stubs';
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
      imports: [MatSnackBarModule, MatIconModule, MatButtonModule, MatTooltipModule],
      providers: [
        { provide: UsersService, useClass: UsersStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ExtendedDockstoreToolService, useClass: ExtendedDockstoreToolStubService },
      ],
    }).compileComponents();
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

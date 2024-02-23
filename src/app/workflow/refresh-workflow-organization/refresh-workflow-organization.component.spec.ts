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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DateService } from '../../shared/date.service';
import { ExtendedDockstoreToolService } from '../../shared/extended-dockstoreTool/extended-dockstoreTool.service';
import { ProviderService } from '../../shared/provider.service';

import { RefreshService } from '../../shared/refresh.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { UsersService } from '../../shared/openapi/api/users.service';
import {
  DateStubService,
  ExtendedDockstoreToolStubService,
  ProviderStubService,
  RefreshStubService,
  UsersStubService,
  WorkflowStubService,
} from '../../test/service-stubs';
import { RefreshWorkflowOrganizationComponent } from './refresh-workflow-organization.component';

describe('RefreshWorkflowOrganizationComponent', () => {
  let component: RefreshWorkflowOrganizationComponent;
  let fixture: ComponentFixture<RefreshWorkflowOrganizationComponent>;
  const matDialogStub = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RefreshWorkflowOrganizationComponent],
        imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule, HttpClientTestingModule],
        providers: [
          { provide: UsersService, useClass: UsersStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: RefreshService, useClass: RefreshStubService },
          { provide: ExtendedDockstoreToolService, useClass: ExtendedDockstoreToolStubService },
          { provide: DateService, useClass: DateStubService },
          { provide: ProviderService, useClass: ProviderStubService },
          { provide: MatDialog, useValue: matDialogStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshWorkflowOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

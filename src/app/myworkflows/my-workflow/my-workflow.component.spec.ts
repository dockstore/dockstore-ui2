/*
 *    Copyright 2018 OICR
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'ng2-ui-auth';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { MyEntriesModule } from '../../shared/modules/my-entries.module';
import { RefreshService } from '../../shared/refresh.service';
import { TokenQuery } from '../../shared/state/token.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { UsersService } from '../../shared/swagger/api/users.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Configuration } from '../../shared/swagger/configuration';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
import { RouterLinkStubDirective } from '../../test';
import { RouterOutletStubComponent } from '../../test/router-stubs';
import {
  AccountsStubService,
  AuthStubService,
  ConfigurationStub,
  RefreshStubService,
  RegisterWorkflowModalStubService,
  UrlResolverStubService,
  UsersStubService,
  WorkflowsStubService,
  WorkflowStubService
} from '../../test/service-stubs';
import { RegisterWorkflowModalService } from '../../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyBioWorkflowsService } from '../my-bio-workflows.service';
import { MyServicesService } from '../my-services.service';
import { MyWorkflowsService } from '../myworkflows.service';
import { MyWorkflowComponent } from './my-workflow.component';

describe('MyWorkflowsComponent', () => {
  let component: MyWorkflowComponent;
  let fixture: ComponentFixture<MyWorkflowComponent>;
  let registerWorkflowModalService: RegisterWorkflowModalService;
  let refreshService: RefreshService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyWorkflowComponent, RouterLinkStubDirective, RouterOutletStubComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, CustomMaterialModule, MyEntriesModule],
      providers: [
        UserQuery,
        { provide: Configuration, useClass: ConfigurationStub },
        { provide: UsersService, useClass: UsersStubService },
        { provide: AuthService, useClass: AuthStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
        MyWorkflowsService,
        MyBioWorkflowsService,
        MyServicesService,
        TokenQuery,
        { provide: AccountsService, useClass: AccountsStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: UrlResolverService, useClass: UrlResolverStubService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {}
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    registerWorkflowModalService = fixture.debugElement.injector.get(RegisterWorkflowModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set observables', () => {
    registerWorkflowModalService = fixture.debugElement.injector.get(RegisterWorkflowModalService);
    spyOn(registerWorkflowModalService, 'setWorkflowRepository');
    component.setRegisterEntryModalInfo('a/b');
    expect(registerWorkflowModalService.setWorkflowRepository).toHaveBeenCalled();
  });
  it('should refresh workflows', () => {
    component.user = { id: 1 };
    refreshService = fixture.debugElement.injector.get(RefreshService);
    spyOn(refreshService, 'refreshAllWorkflows');
    component.refreshAllEntries();
    expect(refreshService.refreshAllWorkflows).toHaveBeenCalled();
  });
});

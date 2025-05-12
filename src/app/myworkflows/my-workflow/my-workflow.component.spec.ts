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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackLoginService } from 'app/shared/track-login.service';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { MytoolsService } from '../../mytools/mytools.service';
import { AuthService } from '../../ng2-ui-auth/public_api';
import { BioschemaService } from '../../shared/bioschema.service';
import { ContainerService } from '../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { ExtendedToolsService } from '../../shared/extended-tools.service';
import { ExtendedWorkflowsService } from '../../shared/extended-workflows.service';
import { MetadataService } from '../../shared/openapi';
import { UsersService } from '../../shared/openapi/api/users.service';
import { WorkflowsService } from '../../shared/openapi/api/workflows.service';
import { Configuration } from '../../shared/openapi/configuration';
import { ProviderService } from '../../shared/provider.service';
import { RefreshService } from '../../shared/refresh.service';
import { MyEntriesQuery } from '../../shared/state/my-entries.query';
import { MyEntriesStateService } from '../../shared/state/my-entries.service';
import { MyEntriesStore } from '../../shared/state/my-entries.store';
import { TokenQuery } from '../../shared/state/token.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
import { RouterLinkStubDirective } from '../../test';
import { RouterOutletStubComponent } from '../../test/router-stubs';
import {
  AccountsStubService,
  AuthStubService,
  ConfigurationStub,
  ContainerStubService,
  DateStubService,
  MetadataStubService,
  ProviderStubService,
  RefreshStubService,
  RegisterWorkflowModalStubService,
  TrackLoginStubService,
  UrlResolverStubService,
  UsersStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from '../../test/service-stubs';
import { RegisterWorkflowModalService } from '../../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyWorkflowsService } from '../myworkflows.service';
import { MyWorkflowComponent } from './my-workflow.component';

describe('MyWorkflowsComponent', () => {
  let component: MyWorkflowComponent;
  let fixture: ComponentFixture<MyWorkflowComponent>;
  let registerWorkflowModalService: RegisterWorkflowModalService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RouterLinkStubDirective, RouterOutletStubComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          BrowserAnimationsModule,
          MatSnackBarModule,
          MatDialogModule,
          MyWorkflowComponent,
        ],
        providers: [
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          { provide: MetadataService, useClass: MetadataStubService },
          UserQuery,
          { provide: Configuration, useClass: ConfigurationStub },
          { provide: UsersService, useClass: UsersStubService },
          { provide: AuthService, useClass: AuthStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: RefreshService, useClass: RefreshStubService },
          { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
          { provide: DateService, useClass: DateStubService },
          BioschemaService,
          ExtendedToolsService,
          ExtendedWorkflowsService,
          MyEntriesQuery,
          MyEntriesStateService,
          MyEntriesStore,
          MyWorkflowsService,
          MytoolsService,
          TokenQuery,
          { provide: AccountsService, useClass: AccountsStubService },
          { provide: ProviderService, useClass: ProviderStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: TrackLoginService, useClass: TrackLoginStubService },
          {
            provide: MatDialogRef,
            useValue: {
              close: (dialogResult: any) => {},
            },
          },
        ],
      }).compileComponents();
    })
  );

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
});

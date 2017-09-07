import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'ng2-ui-auth';

import { RefreshService } from '../shared/refresh.service';
import { RouterLinkStubDirective } from '../test';
import { UserService } from './../loginComponents/user.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { Configuration } from './../shared/swagger/configuration';
import { WorkflowService } from './../shared/workflow.service';
import { sampleWorkflow1, sampleWorkflow2, sampleWorkflow3 } from './../test/mocked-objects';
import { RouterOutletStubComponent } from './../test/router-stubs';
import {
    AuthStubService,
    ConfigurationStub,
    RefreshStubService,
    RegisterWorkflowModalStubService,
    UsersStubService,
    UserStubService,
    WorkflowStubService,
} from './../test/service-stubs';
import { RegisterWorkflowModalService } from './../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyWorkflowsComponent } from './myworkflows.component';

describe('MyWorkflowsComponent', () => {
  let component: MyWorkflowsComponent;
  let fixture: ComponentFixture<MyWorkflowsComponent>;
  let registerWorkflowModalService: RegisterWorkflowModalService;
  let refreshService: RefreshService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkflowsComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Configuration, useClass: ConfigurationStub },
        { provide: UsersService, useClass: UsersStubService },
        { provide: AuthService, useClass: AuthStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
        { provide: UserService, useClass: UserStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    registerWorkflowModalService = fixture.debugElement.injector.get(RegisterWorkflowModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set observables', () => {
    registerWorkflowModalService = fixture.debugElement.injector.get(RegisterWorkflowModalService);
    spyOn(registerWorkflowModalService, 'setIsModalShown');
    spyOn(registerWorkflowModalService, 'setWorkflowRepository');
    component.showModal();
    component.setModalGitURL('a/b');
    expect(registerWorkflowModalService.setIsModalShown).toHaveBeenCalled();
    expect(registerWorkflowModalService.setWorkflowRepository).toHaveBeenCalled();
  });
  it('should refresh workflows', () => {
    refreshService = fixture.debugElement.injector.get(RefreshService);
    spyOn(refreshService, 'refreshAllWorkflows');
    component.refreshAllWorkflows();
    expect(refreshService.refreshAllWorkflows).toHaveBeenCalled();
  });
  it('should check if it contains workflows', () => {
    component.workflow = {
      id: 5
    };
    fixture.detectChanges();
    expect(component.containSelectedWorkflow({workflows: [sampleWorkflow1, sampleWorkflow2, sampleWorkflow3]})).toBeFalsy();
    component.workflow = {
      id: 3
    };
    fixture.detectChanges();
    expect(component.containSelectedWorkflow({workflows: [sampleWorkflow1, sampleWorkflow2, sampleWorkflow3]})).toBeTruthy();
  });
});

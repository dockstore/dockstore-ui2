import { UsersService } from './../shared/swagger/api/users.service';
import { RegisterWorkflowModalService } from './../workflow/register-workflow-modal/register-workflow-modal.service';
import { RefreshService } from '../shared/refresh.service';
import { WorkflowService } from './../shared/workflow.service';
import { HttpService } from '../shared/http.service';
import { RouterOutletStubComponent } from './../test/router-stubs';
import { RouterLinkStubDirective } from '../test';
import { UserService } from '../loginComponents/user.service';
import { ConfigurationStub, UsersServiceStub,
  HttpStubService, WorkflowStubService, RefreshStubService, RegisterWorkflowModalStubService } from './../test/service-stubs';
import { Configuration } from './../shared/swagger/configuration';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyWorkflowsComponent } from './myworkflows.component';

describe('MyWorkflowsComponent', () => {
  let component: MyWorkflowsComponent;
  let fixture: ComponentFixture<MyWorkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkflowsComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Configuration, useClass: ConfigurationStub },
        { provide: UsersService, useClass: UsersServiceStub },
        { provide: HttpService, useClass: HttpStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

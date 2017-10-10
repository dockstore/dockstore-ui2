import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from './../../loginComponents/user.service';
import { StateService } from './../../shared/state.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { WorkflowService } from './../../shared/workflow.service';
import { StateStubService, UsersStubService, UserStubService, WorkflowStubService } from './../../test/service-stubs';
import { RefreshWorkflowOrganizationComponent } from './refresh-workflow-organization.component';

/* tslint:disable:no-unused-variable */
describe('RefreshWorkflowOrganizationComponent', () => {
  let component: RefreshWorkflowOrganizationComponent;
  let fixture: ComponentFixture<RefreshWorkflowOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshWorkflowOrganizationComponent ],
      providers: [
        { provide: UserService, useClass: UserStubService },
        { provide: StateService, useClass: StateStubService },
        { provide: UsersService, useClass: UsersStubService },
        { provide: WorkflowService, useClass: WorkflowStubService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshWorkflowOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

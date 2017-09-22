import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateService } from '../../shared/state.service';
import { StateStubService, UserStubService } from '../../test/service-stubs';
import { UserService } from './../../loginComponents/user.service';
import { ContainerService } from './../../shared/container.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { ContainerStubService, UsersStubService } from './../../test/service-stubs';
import { RefreshToolOrganizationComponent } from './refresh-tool-organization.component';

/* tslint:disable:no-unused-variable */
describe('RefreshToolOrganizationComponent', () => {
  let component: RefreshToolOrganizationComponent;
  let fixture: ComponentFixture<RefreshToolOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefreshToolOrganizationComponent],
      providers: [
        { provide: UserService, useClass: UserStubService },
        { provide: StateService, useClass: StateStubService },
        { provide: UsersService, useClass: UsersStubService },
        { provide: ContainerService, useClass: ContainerStubService }]
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RefreshService } from '../../../shared/refresh.service';
import { UsersService } from '../../../shared/openapi';
import { UserService } from '../../../shared/user/user.service';
import { RefreshStubService, UsersStubService, UserStubService } from '../../../test/service-stubs';
import { ChangeUsernameComponent } from '../internal/change-username/change-username.component';
import { ControlsComponent } from './controls.component';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, ReactiveFormsModule, ControlsComponent, ChangeUsernameComponent],
        providers: [
          { provide: UserService, useClass: UserStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: RefreshService, useClass: RefreshStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

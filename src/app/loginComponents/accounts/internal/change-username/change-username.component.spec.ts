import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RefreshService } from '../../../../shared/refresh.service';
import { UsersService } from '../../../../shared/swagger/api/users.service';
import { UserService } from '../../../../shared/user/user.service';
import { RefreshStubService, UsersStubService, UserStubService } from '../../../../test/service-stubs';
import { ChangeUsernameComponent } from './change-username.component';

describe('ChangeUsernameComponent', () => {
  let component: ChangeUsernameComponent;
  let fixture: ComponentFixture<ChangeUsernameComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeUsernameComponent],
        imports: [
          ReactiveFormsModule,
          MatIconModule,
          MatButtonModule,
          MatTooltipModule,
          MatProgressSpinnerModule,
          MatInputModule,
          MatFormFieldModule,
          MatCardModule,
          BrowserAnimationsModule,
        ],
        providers: [
          { provide: UserService, useClass: UserStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: RefreshService, useClass: RefreshStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

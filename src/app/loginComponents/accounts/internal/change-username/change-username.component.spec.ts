import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RefreshService } from '../../../../shared/refresh.service';
import { UsersService } from '../../../../shared/openapi/api/users.service';
import { UserService } from '../../../../shared/user/user.service';
import { RefreshStubService, UsersStubService, UserStubService } from '../../../../test/service-stubs';
import { ChangeUsernameComponent } from './change-username.component';

describe('ChangeUsernameComponent', () => {
  let component: ChangeUsernameComponent;
  let fixture: ComponentFixture<ChangeUsernameComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
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
          ChangeUsernameComponent,
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

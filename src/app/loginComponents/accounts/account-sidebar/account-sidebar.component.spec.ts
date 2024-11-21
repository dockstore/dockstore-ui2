import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountSidebarComponent } from './account-sidebar.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../shared/openapi/api/users.service';
import { UserService } from '../../../shared/user/user.service';
import { UsersStubService, UserStubService } from '../../../test/service-stubs';
import { GravatarService } from '../../../gravatar/gravatar.service';

describe('AccountSidebarComponent', () => {
  let component: AccountSidebarComponent;
  let fixture: ComponentFixture<AccountSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FlexLayoutModule,
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatSnackBarModule,
        MatDialogModule,
        RouterTestingModule,
        AccountSidebarComponent,
      ],
      providers: [
        { provide: UsersService, useClass: UsersStubService },
        { provide: UserService, useClass: UserStubService },
        { provide: GravatarService, useClass: GravatarService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

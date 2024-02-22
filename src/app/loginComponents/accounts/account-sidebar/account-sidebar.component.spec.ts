import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountSidebarComponent } from './account-sidebar.component';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { UsersService } from '../../../shared/openapi/api/users.service';
import { UserService } from '../../../shared/user/user.service';
import { UsersStubService, UserStubService } from '../../../test/service-stubs';
import { GravatarService } from '../../../gravatar/gravatar.service';

describe('AccountSidebarComponent', () => {
  let component: AccountSidebarComponent;
  let fixture: ComponentFixture<AccountSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSidebarComponent],
      imports: [CustomMaterialModule, FlexLayoutModule, CommonModule, MatTableModule, MatLegacyButtonModule, RouterTestingModule],
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

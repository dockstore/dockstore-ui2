import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSidebarComponent } from './account-sidebar.component';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../shared/swagger/api/users.service';
import { UserService } from '../../../shared/user/user.service';
import { UsersStubService, UserStubService } from '../../../test/service-stubs';
import { GravatarService } from '../../../gravatar/gravatar.service';

describe('AccountSidebarComponent', () => {
  let component: AccountSidebarComponent;
  let fixture: ComponentFixture<AccountSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSidebarComponent],
      imports: [CustomMaterialModule, FlexLayoutModule, CommonModule, MatTableModule],
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

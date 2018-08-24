import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { UsersService } from '../../../shared/swagger';
import { RefreshStubService, UsersStubService, UserStubService } from '../../../test/service-stubs';
import { UserService } from '../../user.service';
import { ChangeUsernameComponent } from '../internal/change-username/change-username.component';
import { RefreshService } from '../../../shared/refresh.service';
import { ControlsComponent } from './controls.component';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlsComponent, ChangeUsernameComponent ],
      imports: [CustomMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [{provide: UserService, useClass: UserStubService},
      {provide: UsersService, useClass: UsersStubService},
      { provide: RefreshService, useClass: RefreshStubService }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

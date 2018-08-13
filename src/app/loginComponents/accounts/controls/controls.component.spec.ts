import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { ControlsComponent } from './controls.component';
import { ChangeUsernameComponent } from '../internal/change-username/change-username.component';
import { UserService } from '../../user.service';
import { RefreshService } from './../../../shared/refresh.service';
import { UserStubService, UsersStubService, RefreshStubService } from '../../../test/service-stubs';
import { UsersService } from '../../../shared/swagger';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlsComponent, ChangeUsernameComponent ],
      imports: [CustomMaterialModule, BrowserAnimationsModule],
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

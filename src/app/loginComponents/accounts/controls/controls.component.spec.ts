import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { ControlsComponent } from './controls.component';
import { UserService } from '../../user.service';
import { UserStubService, UsersStubService } from '../../../test/service-stubs';
import { UsersService } from '../../../shared/swagger';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlsComponent ],
      imports: [CustomMaterialModule],
      providers: [{provide: UserService, useClass: UserStubService},
      {provide: UsersService, useClass: UsersStubService}
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

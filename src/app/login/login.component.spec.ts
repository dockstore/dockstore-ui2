import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from './login.service';
import { TrackLoginStubService, LoginStubService } from './../test/service-stubs';
import { TrackLoginService } from './../shared/track-login.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule],
      providers: [ {provide: TrackLoginService, useClass: TrackLoginStubService},
        { provide: LoginService, useClass: LoginStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { UserService } from './../loginComponents/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from './login.service';
import { LoginStubService, TrackLoginStubService, UserStubService } from './../test/service-stubs';
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
        { provide: LoginService, useClass: LoginStubService},
        { provide: UserService, useClass: UserStubService }]
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

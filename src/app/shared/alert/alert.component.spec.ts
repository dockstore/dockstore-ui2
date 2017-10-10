import { ErrorStubService } from './../../test/service-stubs';
import { ErrorService } from './../../shared/error.service';
import { StateStubService } from '../../test/service-stubs';
import { StateService } from '../state.service';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlertComponent } from './alert.component';

describe('RefreshAlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertComponent ],
      providers: [ {provide: StateService, useClass: StateStubService},
      { provide: ErrorService, useClass: ErrorStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

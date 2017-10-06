import { StateStubService } from '../../test/service-stubs';
import { StateService } from '../state.service';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RefreshAlertComponent } from './refresh-alert.component';

describe('RefreshAlertComponent', () => {
  let component: RefreshAlertComponent;
  let fixture: ComponentFixture<RefreshAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshAlertComponent ],
      providers: [ {provide: StateService, useClass: StateStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorService } from '../../shared/error.service';
import { ErrorStubService } from '../../test/service-stubs';
import { AlertComponent } from './alert.component';

describe('RefreshAlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        { provide: ErrorService, useClass: ErrorStubService }]
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatProgressBarModule, MatSnackBarModule, MatCardModule } from '@angular/material';

import { AlertComponent } from './alert.component';

describe('RefreshAlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressBarModule, MatSnackBarModule, MatIconModule, MatCardModule],
      declarations: [AlertComponent]
    }).compileComponents();
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

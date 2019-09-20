import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoggedInComponent } from './home-logged-in.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { TwitterService } from '../../shared/twitter.service';

describe('HomeLoggedInComponent', () => {
  let component: HomeLoggedInComponent;
  let fixture: ComponentFixture<HomeLoggedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeLoggedInComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TabsModule.forRoot(), RouterTestingModule, MatButtonModule, MatIconModule, MatDialogModule],
      providers: [TwitterService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

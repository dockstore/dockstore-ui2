import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { TwitterService } from '../../shared/twitter.service';
import { HomeLoggedInComponent } from './home-logged-in.component';

describe('HomeLoggedInComponent', () => {
  let component: HomeLoggedInComponent;
  let fixture: ComponentFixture<HomeLoggedInComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeLoggedInComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, MatButtonModule, MatIconModule, MatDialogModule],
        providers: [TwitterService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

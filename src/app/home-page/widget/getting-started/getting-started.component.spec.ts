import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '../../../test';
import { GettingStartedComponent } from './getting-started.component';

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RouterLinkStubDirective],
        imports: [RouterTestingModule, MatIconModule, MatButtonModule, GettingStartedComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

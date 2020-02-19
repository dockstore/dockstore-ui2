import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonModule, MatIconModule } from '@angular/material';
import { RouterLinkStubDirective } from '../../../test';
import { GettingStartedComponent } from './getting-started.component';

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GettingStartedComponent, RouterLinkStubDirective],
      imports: [MatIconModule, MatButtonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

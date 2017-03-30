import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayContainersComponent } from './display-containers.component';

describe('DisplayContainersComponent', () => {
  let component: DisplayContainersComponent;
  let fixture: ComponentFixture<DisplayContainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayContainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

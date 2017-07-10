import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListentryComponent } from './listentry.component';

describe('ListentryComponent', () => {
  let component: ListentryComponent;
  let fixture: ComponentFixture<ListentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

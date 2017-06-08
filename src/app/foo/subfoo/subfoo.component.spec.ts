import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubfooComponent } from './subfoo.component';

describe('SubfooComponent', () => {
  let component: SubfooComponent;
  let fixture: ComponentFixture<SubfooComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubfooComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubfooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

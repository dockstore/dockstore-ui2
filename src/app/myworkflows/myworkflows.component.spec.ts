import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyworkflowsComponent } from './myworkflows.component';

describe('MyworkflowsComponent', () => {
  let component: MyworkflowsComponent;
  let fixture: ComponentFixture<MyworkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyworkflowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyworkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

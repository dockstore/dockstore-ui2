import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkflowsComponent } from './myworkflows.component';

describe('MyWorkflowsComponent', () => {
  let component: MyWorkflowsComponent;
  let fixture: ComponentFixture<MyWorkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkflowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

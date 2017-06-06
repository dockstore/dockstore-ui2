import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchWorkflowComponent } from './launch.component';

describe('LaunchWorkflowComponent', () => {
  let component: LaunchWorkflowComponent;
  let fixture: ComponentFixture<LaunchWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerWorkflowStubService } from './../../../test/service-stubs';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow.component';

describe('LaunchCheckerWorkflowComponent', () => {
  let component: LaunchCheckerWorkflowComponent;
  let fixture: ComponentFixture<LaunchCheckerWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchCheckerWorkflowComponent],
      providers: [{ provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchCheckerWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

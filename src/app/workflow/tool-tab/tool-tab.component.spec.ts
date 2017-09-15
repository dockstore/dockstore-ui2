import { WorkflowsService } from '../../shared/swagger';
import { WorkflowService } from './../../shared/workflow.service';
import { WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { FormsModule } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { ToolTabComponent } from './tool-tab.component';

describe('ToolTabComponent', () => {
  let component: ToolTabComponent;
  let fixture: ComponentFixture<ToolTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTabComponent ],
      imports: [FormsModule],
      providers: [
        {provide: WorkflowService, useClass: WorkflowStubService},
      {provide: WorkflowsService, useClass: WorkflowsStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

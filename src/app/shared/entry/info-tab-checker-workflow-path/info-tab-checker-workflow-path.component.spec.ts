import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CheckerWorkflowStubService, RegisterCheckerWorkflowStubService } from './../../../test/service-stubs';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { RegisterCheckerWorkflowService } from './../register-checker-workflow/register-checker-workflow.service';
import { InfoTabCheckerWorkflowPathComponent } from './info-tab-checker-workflow-path.component';

describe('InfoTabCheckerWorkflowPathComponent', () => {
  let component: InfoTabCheckerWorkflowPathComponent;
  let fixture: ComponentFixture<InfoTabCheckerWorkflowPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TooltipModule.forRoot(), FormsModule],
      providers: [
        { provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService },
        { provide: RegisterCheckerWorkflowService, useClass: RegisterCheckerWorkflowStubService }],
      declarations: [InfoTabCheckerWorkflowPathComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTabCheckerWorkflowPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

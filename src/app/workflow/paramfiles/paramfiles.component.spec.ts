import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { ParamfilesService } from './../../container/paramfiles/paramfiles.service';
import { FileService } from './../../shared/file.service';
import { WorkflowService } from './../../shared/workflow.service';
import { FileStubService, ParamFilesStubService, WorkflowStubService } from './../../test/service-stubs';
import { ParamfilesWorkflowComponent } from './paramfiles.component';

describe('ParamfilesWorkflowComponent', () => {
  let component: ParamfilesWorkflowComponent;
  let fixture: ComponentFixture<ParamfilesWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParamfilesWorkflowComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ParamfilesService, useClass: ParamFilesStubService },
        HighlightJsService,
        { provide: FileService, useClass: FileStubService},
        { provide: WorkflowService, useClass: WorkflowStubService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamfilesWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

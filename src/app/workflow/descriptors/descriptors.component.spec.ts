import { WorkflowDescriptorService } from './workflow-descriptor.service';
import { WorkflowService } from './../../shared/workflow.service';
import { FileService } from './../../shared/file.service';
import { DescriptorsStubService, FileStubService, WorkflowStubService } from './../../test/service-stubs';
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DescriptorsWorkflowComponent } from './descriptors.component';

describe('DescriptorsWorkflowComponent', () => {
  let component: DescriptorsWorkflowComponent;
  let fixture: ComponentFixture<DescriptorsWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsWorkflowComponent ],
      imports: [ HighlightJsModule],
      providers: [ HighlightJsService, {
        provide: WorkflowDescriptorService, useClass: DescriptorsStubService
      }, {provide: FileService, useClass: FileStubService}, {
        provide: WorkflowService, useClass: WorkflowStubService
      }],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

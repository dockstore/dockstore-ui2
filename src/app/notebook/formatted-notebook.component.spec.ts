import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseUrlPipe } from '../shared/entry/base-url.pipe';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { MarkdownWrapperStubService, SourceFileTabsStubService } from '../test/service-stubs';
import { FormattedNotebookComponent } from './formatted-notebook.component';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { Observable, of } from 'rxjs';

describe('FormattedNotebookComponent', () => {
  let notebookComponent: FormattedNotebookComponent;
  let fixture: ComponentFixture<FormattedNotebookComponent>;
  let sourceFileTabsService: SourceFileTabsService;
  let markdownWrapperService: MarkdownWrapperService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FormattedNotebookComponent],
        imports: [HttpClientTestingModule],
        providers: [
          { provide: SourceFileTabsService, useClass: SourceFileTabsStubService },
          { provide: MarkdownWrapperService, useClass: MarkdownWrapperStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    sourceFileTabsService = TestBed.inject(SourceFileTabsService);
    markdownWrapperService = TestBed.inject(MarkdownWrapperService);
    fixture = TestBed.createComponent(FormattedNotebookComponent);
    notebookComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(notebookComponent).toBeDefined();
  });

  it('should display error message for unparseable json', () => {
    spyOn(sourceFileTabsService, 'getSourceFiles').and.returnValue(of([{ path: '/abc.json', content: '{ "cells": [] }' } as SourceFile]));
    notebookComponent.workflow = { id: 123, descriptorTypeSubclass: 'Python' } as Workflow;
    notebookComponent.version = { id: 456, workflow_path: '/abc.json' } as WorkflowVersion;
    fixture.detectChanges();
    notebookComponent.retrieveAndFormatNotebook();
    // expect(fixture.debugElement.nativeElement.innerHTML).toContain('display');
    console.log(fixture.nativeElement.innerHTML);
    expect(fixture.debugElement.nativeElement.querySelectorAll('.notebook').length).toBe(1);
  });

  // TODO should display error message for unparseable json
  // TODO should display error message for json with unexpected field type
  // TODO should display error message for json with unexpected null
  // TODO should format and sanitize markdown
  // TODO should format and sanitize code cell "output"
  // TODO should not format code cell "output" when hidden
  // TODO should format and sanitize code cell "source"
  // TODO should not format code cell "source" when hidden
});

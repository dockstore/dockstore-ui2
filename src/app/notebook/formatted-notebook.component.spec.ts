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

  function formatDetails(sourceFiles: SourceFile[], workflow: Workflow, version: WorkflowVersion, baseUrl: string) {
    spyOn(sourceFileTabsService, 'getSourceFiles').and.returnValue(of(sourceFiles));
    notebookComponent.workflow = workflow;
    notebookComponent.version = version;
    notebookComponent.baseUrl = baseUrl;
    notebookComponent.ngOnChanges();
    fixture.detectChanges();
  }

  function format(notebook: string) {
    formatDetails([makeSourceFile(notebook, '/main.ipynb')], makeWorkflow('Python'), makeVersion('/main.ipynb'), '');
  }

  function makeSourceFile(content: string, path: string, type: SourceFile.TypeEnum = SourceFile.TypeEnum.DOCKSTOREJUPYTER): SourceFile {
    return { content: content, path: path, type: type } as SourceFile;
  }

  function makeWorkflow(language: string): Workflow {
    return { id: 123, descriptorTypeSubclass: language } as Workflow;
  }

  function makeNotebook(cells: any[]): string {
    return JSON.stringify({ cells: cells });
  }

  function makeVersion(workflowPath: string): WorkflowVersion {
    return { id: 456, workflow_path: workflowPath } as WorkflowVersion;
  }

  function makeCodeCell(source: string, outputs: any[]) {
    return { cell_type: 'code', source: source, outputs: outputs };
  }

  function makeStreamOutput(text: string) {
    return { output_type: 'stream', text: text };
  }

  function makeDisplayDataOutput(dataMimeBundle: any, metadataMimeBundle?: any) {
    return { output_type: 'display_data', data: dataMimeBundle, ...(metadataMimeBundle && { metadata: metadataMimeBundle }) };
  }

  function base64(value: string) {
    return btoa(value);
  }

  function confirmSuccess() {
    const element: HTMLElement = fixture.nativeElement;
    expect(notebookComponent.displayError).toBeFalse();
    expect(element.querySelectorAll('.notebook').length).toBe(1);
    expect(element.textContent).not.toContain('The notebook could not be displayed.');
  }

  function confirmError() {
    const element: HTMLElement = fixture.nativeElement;
    expect(notebookComponent.displayError).toBeTrue();
    expect(element.querySelectorAll('.notebook').length).toBe(0);
    expect(element.textContent).toContain('The notebook could not be displayed.');
  }

  it('should create the component', () => {
    expect(notebookComponent).toBeDefined();
  });

  it('should display empty notebook', () => {
    format('{ "cells": [] }');
    confirmSuccess();
  });

  it('should error on undefined json', () => {
    format(undefined);
    confirmError();
  });

  it('should error on malformed json', () => {
    format('{');
    confirmError();
  });

  it('should error on unexpected null field', () => {
    format('{ "cells": null }');
    confirmError();
  });

  it('should error if there is not a primary descriptor', () => {
    const sourceFile = makeSourceFile('{ "cells": [] }', '/abc.ipynb');
    formatDetails([sourceFile], makeWorkflow('Python'), makeVersion('/123.ipynb'), '');
    confirmError();
  });

  it('should error if the primary descriptor is not a jupyter file', () => {
    const sourceFile = makeSourceFile('{ "cells": [] }', '/main.ipynb', SourceFile.TypeEnum.DOCKSTORENOTEBOOKOTHER);
    formatDetails([sourceFile], makeWorkflow('Python'), makeVersion('/main.ipynb'), '');
    confirmError();
  });

  it('should format a notebook with one markdown cell', () => {
    format('{ "cells": [ { "cell_type": "markdown", "source": ["a block of markdown"] } ] }');
    expect(fixture.nativeElement.querySelector('.markdown').textContent).toContain('a block of markdown');
    confirmSuccess();
  });

  it('should format a notebook with one code cell with a stream output', () => {
    format(makeNotebook([makeCodeCell('some source code', [makeStreamOutput('some output')])]));
    expect(fixture.nativeElement.querySelector('.count').textContent).not.toBeUndefined();
    expect(fixture.nativeElement.querySelector('.source').textContent).toContain('some source code');
    expect(fixture.nativeElement.querySelector('.output').textContent).toContain('some output');
    confirmSuccess();
  });

  it('should format a notebook with one code cell with a display_data output with image/jpeg available', () => {
    const jpegMimeBundle = { 'image/foo': base64('foo'), 'image/jpeg': base64('jpeg content'), 'text/plain': ['some plain text'] };
    format(makeNotebook([makeCodeCell('some source code', [makeDisplayDataOutput(jpegMimeBundle)])]));
    console.log(fixture.nativeElement.querySelector('.output img'));
    expect(fixture.nativeElement.querySelector('.source').textContent).toContain('some source code');
    expect(fixture.nativeElement.querySelector('.output img').getAttribute('src')).toContain(
      `data:image/jpeg;base64,${base64('jpeg content')}`
    );
    confirmSuccess();
  });

  it('should format a notebook with one code cell with a display_data output with text/plain available', () => {
    const textMimeBundle = { 'image/foo': base64('foo'), 'application/root': 'foo', 'text/plain': ['some plain text'] };
    format(makeNotebook([makeCodeCell('some source code', [makeDisplayDataOutput(textMimeBundle)])]));
    expect(fixture.nativeElement.querySelector('.source').textContent).toContain('some source code');
    expect(fixture.nativeElement.querySelector('.output').innerHTML).toContain('some plain text');
    confirmSuccess();
  });

  it('should gracefully handle a code cell display_data output with no suitable mime types', () => {
    const unsuitableMimeBundle = { 'image/foo': base64('foo'), 'application/foo': 'foo' };
    format(makeNotebook([makeCodeCell('some source code', [makeDisplayDataOutput(unsuitableMimeBundle)])]));
    expect(fixture.nativeElement.querySelector('.source').textContent).toContain('some source code');
    expect(fixture.nativeElement.querySelector('.output')).toBeNull();
    confirmSuccess();
  });

  it('should read the img width and height for a display_data output if the metadata is present', () => {
    const jpegMimeBundle = { 'image/foo': base64('foo'), 'image/jpeg': base64('jpeg content'), 'text/plain': ['some plain text'] };
    const metadataMimeBundle = { 'image/jpeg': { width: 640, height: 480 } };
    format(makeNotebook([makeCodeCell('some source code', [makeDisplayDataOutput(jpegMimeBundle, metadataMimeBundle)])]));
    expect(fixture.nativeElement.querySelector('.output img').getAttribute('width')).toBe('640');
    expect(fixture.nativeElement.querySelector('.output img').getAttribute('height')).toBe('480');
    confirmSuccess();
  });
});

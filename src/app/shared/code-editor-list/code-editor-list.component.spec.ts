import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorListComponent } from './code-editor-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CodeEditorComponent } from './../code-editor/code-editor.component';
import { WorkflowStubService } from './../../test/service-stubs';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { PrivateFileDownloadPipe } from './../../shared/entry/private-file-download.pipe';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { FileService } from './../../shared/file.service';
import { WorkflowService } from '../state/workflow.service';

describe('CodeEditorListComponent', () => {
  let component: CodeEditorListComponent;
  let fixture: ComponentFixture<CodeEditorListComponent>;
  class FileStubService {}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeEditorListComponent, CodeEditorComponent, PublicFileDownloadPipe, PrivateFileDownloadPipe, PrivateFilePathPipe],
      imports: [
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatCardModule,
        ClipboardModule
      ],
      providers: [{ provide: WorkflowService, useClass: WorkflowStubService }, { provide: FileService, useClass: FileStubService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

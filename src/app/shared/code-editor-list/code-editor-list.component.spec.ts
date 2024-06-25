import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { WorkflowService } from '../state/workflow.service';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { FileService } from './../../shared/file.service';
import { WorkflowStubService } from './../../test/service-stubs';
import { CodeEditorComponent } from './../code-editor/code-editor.component';
import { CodeEditorListComponent } from './code-editor-list.component';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CodeEditorListComponent', () => {
  let component: CodeEditorListComponent;
  let fixture: ComponentFixture<CodeEditorListComponent>;
  class FileStubService {}
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatButtonModule,
          MatTabsModule,
          MatToolbarModule,
          MatIconModule,
          MatInputModule,
          MatFormFieldModule,
          MatTooltipModule,
          MatCardModule,
          ClipboardModule,
          HttpClientTestingModule,
          CodeEditorListComponent,
          CodeEditorComponent,
          PublicFileDownloadPipe,
          PrivateFilePathPipe,
        ],
        providers: [
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

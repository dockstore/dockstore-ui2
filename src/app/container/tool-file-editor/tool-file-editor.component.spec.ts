import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { SourceFile } from '../../shared/openapi';

import { WorkflowService } from '../../shared/state/workflow.service';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { ContainerService } from './../../shared/container.service';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { FileService } from './../../shared/file.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedService } from './../../shared/openapi/api/hosted.service';
import { ContainerStubService, HostedStubService, RefreshStubService, WorkflowStubService } from './../../test/service-stubs';
import { ToolFileEditorComponent } from './tool-file-editor.component';

describe('ToolFileEditorComponent', () => {
  let component: ToolFileEditorComponent;
  let fixture: ComponentFixture<ToolFileEditorComponent>;
  class FileStubService {}
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatButtonModule,
          MatTabsModule,
          MatToolbarModule,
          MatIconModule,
          MatSnackBarModule,
          MatInputModule,
          MatFormFieldModule,
          MatSelectModule,
          MatTooltipModule,
          MatCardModule,
          BrowserAnimationsModule,
          ClipboardModule,
          HttpClientModule,
          HttpClientTestingModule,
          ToolFileEditorComponent,
          CodeEditorListComponent,
          CodeEditorComponent,
          PublicFileDownloadPipe,
          PrivateFilePathPipe,
        ],
        providers: [
          { provide: HostedService, useClass: HostedStubService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: RefreshService, useClass: RefreshStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should revert multiple times', () => {
    const content = 'whatevs';
    const newContent = 'new content';
    const sourceFile: SourceFile = {
      absolutePath: '/foo.cwl',
      path: 'foo.cwl',
      type: 'DOCKSTORE_CWL',
      content: content,
      state: SourceFile.StateEnum.COMPLETE,
    };
    component.originalSourceFiles = [sourceFile];
    component.resetFiles();
    expect(component.descriptorFiles[0].content).toBe(content);
    component.descriptorFiles[0].content = newContent;
    // Modifying descriptor copy doesn't modify original:
    expect(sourceFile.content).toBe(content);
    component.resetFiles();
    expect(component.descriptorFiles[0].content).toBe(content);
    component.descriptorFiles[0].content = newContent;
    expect(sourceFile.content).toBe(content);
    // One more revert
    component.resetFiles();
    expect(component.descriptorFiles[0].content).toBe(content);
  });
});

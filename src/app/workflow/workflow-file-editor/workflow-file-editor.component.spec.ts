import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WorkflowService } from '../../shared/state/workflow.service';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { FileService } from './../../shared/file.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { HostedStubService, RefreshStubService, WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { WorkflowFileEditorComponent } from './workflow-file-editor.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkflowFileEditorComponent', () => {
  let component: WorkflowFileEditorComponent;
  let fixture: ComponentFixture<WorkflowFileEditorComponent>;
  class FileStubService {}
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WorkflowFileEditorComponent,
          CodeEditorListComponent,
          CodeEditorComponent,
          PublicFileDownloadPipe,
          PrivateFilePathPipe,
        ],
        imports: [
          MatButtonModule,
          MatTabsModule,
          MatToolbarModule,
          MatIconModule,
          MatInputModule,
          MatFormFieldModule,
          MatTooltipModule,
          ClipboardModule,
          MatSnackBarModule,
          MatCardModule,
          BrowserAnimationsModule,
          HttpClientModule,
          HttpClientTestingModule,
        ],
        providers: [
          { provide: HostedService, useClass: HostedStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: RefreshService, useClass: RefreshStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

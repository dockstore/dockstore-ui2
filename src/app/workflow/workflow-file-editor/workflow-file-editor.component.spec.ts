import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFileEditorComponent } from './workflow-file-editor.component';
import { TabsModule } from 'ngx-bootstrap';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedStubService, WorkflowStubService, RefreshStubService, WorkflowsStubService } from './../../test/service-stubs';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { PrivateFileDownloadPipe } from './../../shared/entry/private-file-download.pipe';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { FileService } from './../../shared/file.service';
import { WorkflowService } from '../../shared/state/workflow.service';

describe('WorkflowFileEditorComponent', () => {
  let component: WorkflowFileEditorComponent;
  let fixture: ComponentFixture<WorkflowFileEditorComponent>;
  class FileStubService {}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowFileEditorComponent,
        CodeEditorListComponent,
        CodeEditorComponent,
        PublicFileDownloadPipe,
        PrivateFileDownloadPipe,
        PrivateFilePathPipe
      ],
      imports: [
        TabsModule.forRoot(),
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        ClipboardModule,
        MatSnackBarModule,
        MatCardModule
      ],
      providers: [
        { provide: HostedService, useClass: HostedStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: FileService, useClass: FileStubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

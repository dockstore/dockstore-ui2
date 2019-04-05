import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFileEditorComponent } from './tool-file-editor.component';
import { TabsModule } from 'ngx-bootstrap';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule,
  MatFormFieldModule, MatSelectModule, MatTooltipModule, MatSnackBarModule, MatCardModule } from '@angular/material';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerService } from './../../shared/container.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedStubService, ContainerStubService, RefreshStubService, WorkflowStubService } from './../../test/service-stubs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { PrivateFileDownloadPipe } from './../../shared/entry/private-file-download.pipe';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { FileService } from './../../shared/file.service';
import { WorkflowService } from '../../shared/state/workflow.service';

describe('ToolFileEditorComponent', () => {
  let component: ToolFileEditorComponent;
  let fixture: ComponentFixture<ToolFileEditorComponent>;
  class FileStubService { }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolFileEditorComponent,
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
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTooltipModule,
        MatCardModule,
        BrowserAnimationsModule,
        ClipboardModule
      ],
      providers: [
        { provide: HostedService, useClass: HostedStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: FileService, useClass: FileStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

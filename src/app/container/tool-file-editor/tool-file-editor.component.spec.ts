import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { WorkflowService } from '../../shared/state/workflow.service';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { ContainerService } from './../../shared/container.service';
import { PrivateFileDownloadPipe } from './../../shared/entry/private-file-download.pipe';
import { PrivateFilePathPipe } from './../../shared/entry/private-file-path.pipe';
import { PublicFileDownloadPipe } from './../../shared/entry/public-file-download.pipe';
import { FileService } from './../../shared/file.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerStubService, HostedStubService, RefreshStubService, WorkflowStubService } from './../../test/service-stubs';
import { ToolFileEditorComponent } from './tool-file-editor.component';

describe('ToolFileEditorComponent', () => {
  let component: ToolFileEditorComponent;
  let fixture: ComponentFixture<ToolFileEditorComponent>;
  class FileStubService {}
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
    }).compileComponents();
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

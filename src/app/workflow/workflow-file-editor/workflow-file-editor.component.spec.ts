import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WorkflowFileEditorComponent } from './workflow-file-editor.component';
import { TabsModule } from 'ngx-bootstrap';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { WorkflowService } from './../../shared/workflow.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedStubService, WorkflowStubService, RefreshStubService, WorkflowsStubService } from './../../test/service-stubs';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';

describe('WorkflowFileEditorComponent', () => {
  let component: WorkflowFileEditorComponent;
  let fixture: ComponentFixture<WorkflowFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowFileEditorComponent,
        CodeEditorListComponent,
        CodeEditorComponent
      ],
      // schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        TabsModule.forRoot(),
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule
      ],
      providers: [
        { provide: HostedService, useClass: HostedStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: RefreshService, useClass: RefreshStubService }
      ]
    })
    .compileComponents();
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

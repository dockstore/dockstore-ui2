import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MyBioWorkflowsService } from 'app/myworkflows/my-bio-workflows.service';
import { MyServicesService } from 'app/myworkflows/my-services.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { MyEntriesStore } from 'app/shared/state/my-entries.store';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, WorkflowsService } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import {
  RegisterToolStubService,
  RegisterWorkflowModalStubService,
  UrlResolverStubService,
  UsersStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from 'app/test/service-stubs';
import { RegisterWorkflowModalService } from 'app/workflow/register-workflow-modal/register-workflow-modal.service';
import { EntryBoxesComponent } from './entry-boxes.component';

describe('EntryBoxesComponent', () => {
  let component: EntryBoxesComponent;
  let fixture: ComponentFixture<EntryBoxesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EntryBoxesComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientTestingModule, MatSnackBarModule],
        providers: [
          { provide: RegisterToolService, useClass: RegisterToolStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: UsersService, useClass: UsersStubService },
          MyServicesService,
          MyBioWorkflowsService,
          MyWorkflowsService,
          MyEntriesStateService,
          MyEntriesStore,
          MyEntriesQuery,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryBoxesComponent);
    component = fixture.componentInstance;
    component.entryType = 'Workflow';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

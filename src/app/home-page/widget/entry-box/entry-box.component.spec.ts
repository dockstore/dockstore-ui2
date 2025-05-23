import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { MyEntriesStore } from 'app/shared/state/my-entries.store';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, WorkflowsService } from 'app/shared/openapi';
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
import { EntryBoxComponent } from './entry-box.component';

describe('EntryBoxComponent', () => {
  let component: EntryBoxComponent;
  let fixture: ComponentFixture<EntryBoxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          MatAutocompleteModule,
          RouterTestingModule,
          MatButtonModule,
          MatIconModule,
          MatDialogModule,
          HttpClientTestingModule,
          MatSnackBarModule,
          EntryBoxComponent,
        ],
        providers: [
          { provide: RegisterToolService, useClass: RegisterToolStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: UsersService, useClass: UsersStubService },
          MyWorkflowsService,
          MyEntriesStateService,
          MyEntriesStore,
          MyEntriesQuery,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryBoxComponent);
    component = fixture.componentInstance;
    component.entryType = 'WORKFLOW';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

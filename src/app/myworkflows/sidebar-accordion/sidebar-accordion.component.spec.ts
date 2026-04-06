import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { RefreshWorkflowOrganizationComponent } from 'app/workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { RefreshService } from '../../shared/refresh.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { RefreshStubService, RegisterWorkflowModalStubService, WorkflowStubService } from './../../test/service-stubs';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { SidebarAccordionComponent } from './sidebar-accordion.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, SidebarAccordionComponent, RefreshWorkflowOrganizationComponent, SelectTabPipe, MatDialogModule],
        providers: [
          {
            provide: RegisterWorkflowModalService,
            useClass: RegisterWorkflowModalStubService,
          },
          { provide: WorkflowService, useClass: WorkflowStubService },
          {
            provide: MatDialogRef,
            useValue: {
              close: () => {},
            },
          },
          {
            provide: RefreshService,
            useClass: RefreshStubService,
          },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

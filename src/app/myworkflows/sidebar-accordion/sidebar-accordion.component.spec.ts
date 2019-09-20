import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { RefreshWorkflowOrganizationComponent } from 'app/workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { GithubNameToIdPipe } from '../../github-name-to-id.pipe';
import { ExpandPanelPipe } from '../../shared/entry/expand-panel.pipe';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { WorkflowService } from '../../shared/state/workflow.service';
import { RefreshStubService, RegisterWorkflowModalStubService, WorkflowStubService } from './../../test/service-stubs';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { SidebarAccordionComponent } from './sidebar-accordion.component';
import { RefreshService } from '../../shared/refresh.service';
describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAccordionComponent, RefreshWorkflowOrganizationComponent, ExpandPanelPipe, SelectTabPipe, GithubNameToIdPipe],
      imports: [HttpClientTestingModule, CustomMaterialModule, RouterTestingModule],
      providers: [
        {
          provide: RegisterWorkflowModalService,
          useClass: RegisterWorkflowModalStubService
        },
        { provide: WorkflowService, useClass: WorkflowStubService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {}
          }
        },
        {
          provide: RefreshService,
          useClass: RefreshStubService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

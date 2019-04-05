import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterWorkflowModalStubService, WorkflowStubService } from './../../test/service-stubs';
import {
  RefreshWorkflowOrganizationComponent,
} from './../../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { SidebarAccordionComponent } from './sidebar-accordion.component';
import {
  MatButtonModule,
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
  MatExpansionModule,
  MatListModule,
  MatTooltipModule,
  MatDialogRef,
  MatDialogModule
} from '@angular/material';
import { ExpandPanelPipe } from '../../shared/entry/expand-panel.pipe';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { WorkflowService } from '../../shared/state/workflow.service';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarAccordionComponent, RefreshWorkflowOrganizationComponent, ExpandPanelPipe, SelectTabPipe ],
      imports: [
        MatDialogModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatListModule,
        MatTooltipModule,
        RouterTestingModule],
      providers: [
        { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        }
      ]
    })
    .compileComponents();
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

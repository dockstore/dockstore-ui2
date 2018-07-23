import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { WorkflowService } from '../../shared/workflow.service';
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
  MatTooltipModule
} from '@angular/material';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarAccordionComponent, RefreshWorkflowOrganizationComponent ],
      imports: [
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
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
        { provide: WorkflowService, useClass: WorkflowStubService }
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

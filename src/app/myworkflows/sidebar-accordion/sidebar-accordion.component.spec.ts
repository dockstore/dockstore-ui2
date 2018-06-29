import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAccordionComponent } from './sidebar-accordion.component';
import {
  RefreshWorkflowOrganizationComponent
} from './../../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { RegisterWorkflowModalStubService } from './../../test/service-stubs';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarAccordionComponent, RefreshWorkflowOrganizationComponent ],
      imports: [ AccordionModule.forRoot(), ModalModule.forRoot(), TabsModule.forRoot() ],
      providers: [
        { provide: RegisterWorkflowModalService, useClass: RegisterWorkflowModalStubService }
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

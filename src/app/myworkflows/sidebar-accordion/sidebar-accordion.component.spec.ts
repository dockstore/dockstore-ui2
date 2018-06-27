import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAccordionComponent } from './sidebar-accordion.component';
import { RegisterWorkflowModalStubService } from './../../test/service-stubs';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarAccordionComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContainerService } from './../../shared/container.service';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { RegisterToolStubService, ContainerStubService } from './../../test/service-stubs';
import { RefreshToolOrganizationComponent } from './../../container/refresh-tool-organization/refresh-tool-organization.component';
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
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { ExpandPanelPipe } from '../../shared/entry/expand-panel.pipe';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAccordionComponent, RefreshToolOrganizationComponent, ExpandPanelPipe, SelectTabPipe],
      imports: [
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatListModule,
        MatTooltipModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RegisterToolService, useClass: RegisterToolStubService },
        { provide: ContainerService, useClass: ContainerStubService }
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

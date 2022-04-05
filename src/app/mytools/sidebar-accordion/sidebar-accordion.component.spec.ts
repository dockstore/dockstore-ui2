import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { RefreshToolOrganizationComponent } from './../../container/refresh-tool-organization/refresh-tool-organization.component';
import { ContainerService } from './../../shared/container.service';
import { ContainerStubService, RegisterToolStubService } from './../../test/service-stubs';
import { SidebarAccordionComponent } from './sidebar-accordion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarAccordionComponent', () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarAccordionComponent, RefreshToolOrganizationComponent, SelectTabPipe],
        imports: [
          MatTabsModule,
          MatToolbarModule,
          MatIconModule,
          MatButtonModule,
          MatExpansionModule,
          MatListModule,
          MatTooltipModule,
          RouterTestingModule,
          HttpClientTestingModule,
        ],
        providers: [
          { provide: RegisterToolService, useClass: RegisterToolStubService },
          { provide: ContainerService, useClass: ContainerStubService },
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

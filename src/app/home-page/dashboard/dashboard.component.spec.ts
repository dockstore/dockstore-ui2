import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MyWorkflowsService } from '../../myworkflows/myworkflows.service';
import { DateService } from '../../shared/date.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { OrgLogoService } from '../../shared/org-logo.service';
import { ProviderService } from '../../shared/provider.service';
import { MyEntriesStateService } from '../../shared/state/my-entries.service';
import { MyEntriesStore } from '../../shared/state/my-entries.store';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { DashboardComponent } from './dashboard.component';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContainerService } from '../../shared/container.service';
import { ContainerStubService, DateStubService, OrgLogoStubService, UrlResolverStubService } from '../../test/service-stubs';
import { MastodonService } from '../../shared/mastodon/mastodon.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          MatButtonModule,
          MatIconModule,
          MatDialogModule,
          MatSnackBarModule,
          DashboardComponent,
          NoopAnimationsModule,
        ],
        providers: [
          MastodonService,
          RegisterToolService,
          MyWorkflowsService,
          ProviderService,
          { provide: DateService, useClass: DateStubService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: OrgLogoService, useClass: OrgLogoStubService },
          MyEntriesStateService,
          MyEntriesStore,
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

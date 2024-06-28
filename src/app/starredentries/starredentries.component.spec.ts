import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MytoolsService } from '../mytools/mytools.service';
import { MyWorkflowsService } from '../myworkflows/myworkflows.service';
import { AuthService } from '../ng2-ui-auth/public_api';
import { ContainerService } from '../shared/container.service';
import { DateService } from '../shared/date.service';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { Configuration } from '../shared/openapi';
import { MyEntriesStateService } from '../shared/state/my-entries.service';
import { MyEntriesStore } from '../shared/state/my-entries.store';
import { TrackLoginService } from '../shared/track-login.service';
import { UrlResolverService } from '../shared/url-resolver.service';
import { ProviderService } from './../shared/provider.service';
import { StarentryService } from './../shared/starentry.service';
import { UsersService } from './../shared/openapi/api/users.service';
import { StarringService } from './../starring/starring.service';
import { OrgLogoService } from './../shared/org-logo.service';
import {
  ImageProviderStubService,
  StarEntryStubService,
  StarringStubService,
  UsersStubService,
  OrgLogoStubService,
  AuthStubService,
  DescriptorLanguageStubService,
  UrlResolverStubService,
  ContainerStubService,
  TrackLoginStubService,
  ConfigurationStub,
  DateStubService,
} from './../test/service-stubs';
import { StarredEntriesComponent } from './starredentries.component';

describe('StarredEntriesComponent', () => {
  let component: StarredEntriesComponent;
  let fixture: ComponentFixture<StarredEntriesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          StarredEntriesComponent,
          MatLegacySnackBarModule,
          NoopAnimationsModule,
          HttpClientTestingModule,
          MatLegacyDialogModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: StarringService, useClass: StarringStubService },
          { provide: ImageProviderService, useClass: ImageProviderStubService },
          { provide: DateService, useClass: DateStubService },
          MyEntriesStateService,
          MyEntriesStore,
          MytoolsService,
          MyWorkflowsService,
          ProviderService,
          { provide: Configuration, useClass: ConfigurationStub },
          { provide: AuthService, useClass: AuthStubService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: StarentryService, useClass: StarEntryStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: OrgLogoService, useClass: OrgLogoStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: TrackLoginService, useClass: TrackLoginStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should check isOwner', () => {
    component.user = {
      id: 5,
    };
    expect(component.isOwner([{ id: 5 }, { id: 10 }])).toBeTruthy();
    expect(component.isOwner([{ id: 6 }, { id: 10 }])).toBeFalsy();
  });
  it('should toggle stargazers', () => {
    component.starGazersChange();
    fixture.detectChanges();
    expect(component.starGazersClicked).toBeTruthy();
  });
});

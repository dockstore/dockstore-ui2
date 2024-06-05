import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'ng2-ui-auth';
import { AppComponent } from './app.component';
import { MytoolsService } from './mytools/mytools.service';
import { MyWorkflowsService } from './myworkflows/myworkflows.service';
import { ServiceInfoService } from './service-info/service-info.service';
import { ContainerService } from './shared/container.service';
import { DateService } from './shared/date.service';
import { DescriptorLanguageService } from './shared/entry/descriptor-language.service';
import { LogoutService } from './shared/logout.service';
import { Configuration, UsersService } from './shared/openapi';
import { PagenumberService } from './shared/pagenumber.service';
import { ProviderService } from './shared/provider.service';
import { MyEntriesStateService } from './shared/state/my-entries.service';
import { MyEntriesStore } from './shared/state/my-entries.store';
import { TrackLoginService } from './shared/track-login.service';
import { UrlResolverService } from './shared/url-resolver.service';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './test/router-stubs';
import {
  AuthStubService,
  ConfigurationStub,
  ContainerStubService,
  DateStubService,
  DescriptorLanguageStubService,
  GA4GHV20StubService,
  LogoutStubService,
  ProviderStubService,
  TosBannerStubService,
  TrackLoginStubService,
  UrlResolverStubService,
  UsersStubService,
} from './test/service-stubs';
import { TosBannerService } from './tosBanner/state/tos-banner.service';

@Component({
  selector: 'app-banner',
  template: '',
  standalone: true,
  imports: [RouterTestingModule, MatSnackBarModule],
})
class BannerStubComponent {}

@Component({
  selector: 'app-navbar',
  template: '',
  standalone: true,
  imports: [RouterTestingModule, MatSnackBarModule],
})
class NavbarStubComponent {}

@Component({
  selector: 'app-footer',
  template: '',
  standalone: true,
  imports: [RouterTestingModule, MatSnackBarModule],
})
class FooterStubComponent {}

@Component({
  selector: 'app-tos-banner',
  template: '',
  standalone: true,
  imports: [RouterTestingModule, MatSnackBarModule],
})
class TosBannerStubComponent {}

@Component({
  selector: 'app-sitewide-notifications',
  template: '',
  standalone: true,
  imports: [RouterTestingModule, MatSnackBarModule],
})
class NotificationStubComponent {}

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RouterLinkStubDirective, RouterOutletStubComponent],
        imports: [
          RouterTestingModule,
          MatLegacyDialogModule,
          MatLegacySnackBarModule,
          HttpClientTestingModule,
          NavbarStubComponent,
          FooterStubComponent,
          BannerStubComponent,
          TosBannerStubComponent,
          NotificationStubComponent,
          AppComponent,
        ],
        providers: [
          { provide: TrackLoginService, useClass: TrackLoginStubService },
          { provide: TosBannerService, useClass: TosBannerStubService },
          { provide: AuthService, useClass: AuthStubService },
          { provide: Configuration, useClass: ConfigurationStub },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: ServiceInfoService, useClass: GA4GHV20StubService },
          { provide: DateService, useClass: DateStubService },
          { provide: ProviderService, useClass: ProviderStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
          { provide: UrlResolverService, useClass: UrlResolverStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: LogoutService, useClass: LogoutStubService },
          MyEntriesStateService,
          MyEntriesStore,
          MytoolsService,
          MyWorkflowsService,
          PagenumberService,
        ],
      }).compileComponents();
    })
  );

  it(
    'should create the app',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
});

import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './test/router-stubs';

import { Component } from '@angular/core';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { AppComponent } from './app.component';
import { TrackLoginService } from './shared/track-login.service';
import { TosBannerStubService, TrackLoginStubService } from './test/service-stubs';
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
          MatSnackBarModule,
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

import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './test/router-stubs';

import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { TrackLoginService } from './shared/track-login.service';
import { TrackLoginStubService } from './test/service-stubs';

@Component({ selector: 'app-banner', template: '' })
class BannerStubComponent {}

@Component({ selector: 'app-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'app-sponsors', template: '' })
class SponsorsStubComponent {}

@Component({ selector: 'app-footer', template: '' })
class FooterStubComponent {}

@Component({ selector: 'app-tos-banner', template: '' })
class TosBannerStubComponent {}

@Component({ selector: 'app-notifications', template: '' })
class NotificationStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarStubComponent,
        SponsorsStubComponent,
        FooterStubComponent,
        BannerStubComponent,
        RouterLinkStubDirective,
        RouterOutletStubComponent,
        TosBannerStubComponent,
        NotificationStubComponent,
      ],
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [{ provide: TrackLoginService, useClass: TrackLoginStubService }],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

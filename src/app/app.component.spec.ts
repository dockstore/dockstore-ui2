import { RouterTestingModule } from '@angular/router/testing';
import { RouterStub } from './test';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';
import { ToasterModule } from './shared/toaster/toaster.module';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './test/router-stubs';
import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { Component } from '@angular/core';

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {}

@Component({selector: 'app-sponsors', template: ''})
class SponsorsStubComponent {}

@Component({selector: 'app-footer', template: ''})
class FooterStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarStubComponent, SponsorsStubComponent, FooterStubComponent,
        RouterLinkStubDirective, RouterOutletStubComponent
      ],
      imports: [RouterTestingModule, ToasterModule, Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

import { NgxMdModule } from 'ngx-md';
import { GA4GHService } from './../../../shared/swagger/api/gA4GH.service';
import { AuthService } from 'ng2-ui-auth';
import { AuthStubService, GA4GHStubService } from './../../../test/service-stubs';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './../../../test/router-stubs';
import { ClipboardModule } from 'ngx-clipboard';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCLIClientComponent } from './downloadcliclient.component';

describe('DownloadCLIClientComponent', () => {
  let component: DownloadCLIClientComponent;
  let fixture: ComponentFixture<DownloadCLIClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadCLIClientComponent,
        RouterLinkStubDirective, RouterOutletStubComponent ],
      imports: [ClipboardModule, NgxMdModule.forRoot()],
      providers: [ {provide: AuthService, useClass: AuthStubService},
      {provide: GA4GHService, useClass: GA4GHStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCLIClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

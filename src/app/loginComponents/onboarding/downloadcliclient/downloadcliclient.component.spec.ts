import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'ng2-ui-auth';
import { ClipboardModule } from 'ngx-clipboard';

import { MetadataService } from '../../../shared/swagger';
import { GA4GHService } from './../../../shared/swagger/api/gA4GH.service';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './../../../test/router-stubs';
import { AuthStubService, GA4GHStubService } from './../../../test/service-stubs';
import { DownloadCLIClientComponent } from './downloadcliclient.component';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DownloadCLIClientComponent', () => {
  let component: DownloadCLIClientComponent;
  let fixture: ComponentFixture<DownloadCLIClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadCLIClientComponent, RouterLinkStubDirective, RouterOutletStubComponent],
      imports: [ClipboardModule, MarkdownModule.forRoot(), MatIconModule, MatButtonModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: GA4GHService, useClass: GA4GHStubService },
        MetadataService
      ]
    }).compileComponents();
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

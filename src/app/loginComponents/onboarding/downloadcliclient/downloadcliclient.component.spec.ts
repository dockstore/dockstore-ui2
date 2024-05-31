import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from 'ng2-ui-auth';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { MetadataService, GA4GHV20Service } from '../../../shared/openapi';
import { ServiceInfoService } from '../../../service-info/service-info.service';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './../../../test/router-stubs';
import { AuthStubService, GA4GHV20StubService } from './../../../test/service-stubs';
import { DownloadCLIClientComponent } from './downloadcliclient.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

describe('DownloadCLIClientComponent', () => {
  let component: DownloadCLIClientComponent;
  let fixture: ComponentFixture<DownloadCLIClientComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RouterLinkStubDirective, RouterOutletStubComponent],
        imports: [
          ClipboardModule,
          MarkdownModule.forRoot(),
          MatIconModule,
          MatButtonModule,
          HttpClientTestingModule,
          MatSnackBarModule,
          MatTabsModule,
          NoopAnimationsModule,
          DownloadCLIClientComponent,
        ],
        providers: [
          { provide: AuthService, useClass: AuthStubService },
          { provide: GA4GHV20Service, useClass: GA4GHV20StubService },
          MetadataService,
          ServiceInfoService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCLIClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

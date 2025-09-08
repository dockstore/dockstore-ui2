import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { SitewideNotificationsComponent } from './sitewide-notifications.component';
import { NotificationsService } from './state/notifications.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SitewideNotificationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SitewideNotificationsComponent,
        NotificationsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should create', inject([SitewideNotificationsComponent], (component: SitewideNotificationsComponent) => {
    expect(component).toBeTruthy();
  }));
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { SitewideNotificationsComponent } from './sitewide-notifications.component';
import { NotificationsService } from './state/notifications.service';

describe('SitewideNotificationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SitewideNotificationsComponent, NotificationsService],
    });
  });

  it('should create', inject([SitewideNotificationsComponent], (component: SitewideNotificationsComponent) => {
    expect(component).toBeTruthy();
  }));
});

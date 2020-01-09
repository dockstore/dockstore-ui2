import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationsComponent } from './notifications.component';
import { mockedNotification, expiredMockNotification } from '../test/mocked-objects';

describe('NotificationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationsComponent]
    });
  });

  it('should create', inject([NotificationsComponent], (component: NotificationsComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should be dismissed when close button is clicked', inject([NotificationsComponent], (component: NotificationsComponent) => {
    component.dismissedNotifications = [];
    component.dismissNotification(mockedNotification);
    expect(component.dismissedNotifications[0]).toEqual({ id: mockedNotification.id, expiration: mockedNotification.expiration });
  }));

  it('should be removed from local storage if expired', inject([NotificationsComponent], (component: NotificationsComponent) => {
    component.dismissedNotifications = [];
    component.dismissNotification(expiredMockNotification);
    component.removeExpiredDisabledNotifications(component.dismissedNotifications);
    expect(component.dismissedNotifications[0]).toEqual(undefined);
  }));
});

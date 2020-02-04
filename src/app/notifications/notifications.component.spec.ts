import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { expiredMockNotification, mockedNotification } from '../test/mocked-objects';
import { NotificationsComponent } from './notifications.component';

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
    component.removeExpiredDisabledNotifications();
    expect(component.dismissedNotifications[0]).toEqual(undefined);
  }));
});

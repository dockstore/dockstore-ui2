import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { NotificationsService } from './notifications.service';
import { NotificationsStore } from './notifications.store';
import { expiredMockNotification, mockedNotification } from '../../test/mocked-objects';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService, NotificationsStore],
      imports: [HttpClientTestingModule],
    });

    notificationsService = TestBed.inject(NotificationsService);
    TestBed.inject(NotificationsStore);
  });

  it('should be created', () => {
    expect(notificationsService).toBeDefined();
  });

  it('should be dismissed when close button is clicked', inject([NotificationsService], (component: NotificationsService) => {
    component.dismissedNotifications = [];
    component.dismissNotification(mockedNotification);
    expect(component.dismissedNotifications[0]).toEqual({ id: mockedNotification.id, expiration: mockedNotification.expiration });
  }));

  it('should be removed from local storage if expired', inject([NotificationsService], (component: NotificationsService) => {
    component.dismissedNotifications = [];
    component.dismissNotification(expiredMockNotification);
    component.removeExpiredDisabledNotifications();
    expect(component.dismissedNotifications[0]).toEqual(undefined);
  }));
});

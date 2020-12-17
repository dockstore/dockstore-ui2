import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsStore } from './notifications.store';

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
});

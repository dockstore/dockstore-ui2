import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsService } from './state/notifications.service';

describe('NotificationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationsComponent, NotificationsService],
    });
  });

  it('should create', inject([NotificationsComponent], (component: NotificationsComponent) => {
    expect(component).toBeTruthy();
  }));
});

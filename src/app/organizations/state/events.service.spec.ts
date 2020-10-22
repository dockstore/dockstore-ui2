import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventsService } from './events.service';
import { EventsStore } from './events.store';

describe('EventsService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsService, EventsStore],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });

    eventsService = TestBed.inject(EventsService);
    TestBed.inject(EventsStore);
  });

  it('should be created', () => {
    expect(eventsService).toBeDefined();
  });
});

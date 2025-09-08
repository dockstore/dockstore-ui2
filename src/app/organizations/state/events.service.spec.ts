import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventsService } from './events.service';
import { EventsStore } from './events.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EventsService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [EventsService, EventsStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    eventsService = TestBed.inject(EventsService);
    TestBed.inject(EventsStore);
  });

  it('should be created', () => {
    expect(eventsService).toBeDefined();
  });
});

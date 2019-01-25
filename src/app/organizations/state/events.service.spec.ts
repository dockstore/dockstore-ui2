import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { EventsStore } from './events.store';

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventsStore: EventsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsService, EventsStore],
      imports: [ HttpClientTestingModule ]
    });

    eventsService = TestBed.get(EventsService);
    eventsStore = TestBed.get(EventsStore);
  });

  it('should be created', () => {
    expect(eventsService).toBeDefined();
  });

});

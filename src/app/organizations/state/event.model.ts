import { ID } from '@datorama/akita';

export interface Event {
  id: ID;
}

/**
 * A factory function that creates Events
 */
export function createEvent(params: Partial<Event>) {
  return {

  } as Event;
}

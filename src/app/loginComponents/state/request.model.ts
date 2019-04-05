import { ID } from '@datorama/akita';

export interface Request {
  id: ID;
}

/**
 * A factory function that creates Requests
 */
export function createRequest(params: Partial<Request>) {
  return {

  } as Request;
}

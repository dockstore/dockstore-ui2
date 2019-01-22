import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Request } from './request.model';
import { Organisation } from '../../shared/swagger';

export interface RequestsState extends EntityState<Request> {
  pendingOrganizations: Array<Organisation>;
}

export function createInitialState(): RequestsState {
  return {
    pendingOrganizations: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'requests' })
export class RequestsStore extends EntityStore<RequestsState, Request> {

  constructor() {
    super(createInitialState());
  }

}


import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Request } from './request.model';
import { Organisation } from '../../shared/swagger';

export interface RequestsState extends EntityState<Request> {
  pendingOrganizationsAdminAndCurator: Array<Organisation>;
}

export function createInitialState(): RequestsState {
  return {
    pendingOrganizationsAdminAndCurator: null,
    myPendingOrganizations: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'requests' })
export class RequestsStore extends EntityStore<RequestsState, Request> {

  constructor() {
    super(createInitialState());
  }

}


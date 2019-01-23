import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Request } from './request.model';
import { Organisation, OrganisationUser } from '../../shared/swagger';

export interface RequestsState extends EntityState<Request> {
  pendingOrganizationsAdminAndCurator: Array<Organisation>;
  myMemberships: Array<OrganisationUser>;
  myOrganizationInvites: Array<OrganisationUser>;
  myPendingOrganizationRequests: Array<OrganisationUser>;
}

export function createInitialState(): RequestsState {
  return {
    pendingOrganizationsAdminAndCurator: null,
    myMemberships: null,
    myOrganizationInvites: null,
    myPendingOrganizationRequests: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'requests' })
export class RequestsStore extends EntityStore<RequestsState, Request> {

  constructor() {
    super(createInitialState());
  }

}


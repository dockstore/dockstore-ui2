import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Organization, OrganizationUser } from '../../shared/swagger';
import { Request } from './request.model';

export interface RequestsState extends EntityState<Request> {
  allPendingOrganizations: Array<Organization>;
  myMemberships: Array<OrganizationUser>;
  myOrganizationInvites: Array<OrganizationUser>;
  myPendingOrganizationRequests: Array<OrganizationUser>;
  myRejectedOrganizationRequests: Array<OrganizationUser>;
}

export function createInitialState(): RequestsState {
  return {
    allPendingOrganizations: null,
    myMemberships: null,
    myOrganizationInvites: null,
    myPendingOrganizationRequests: null,
    myRejectedOrganizationRequests: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'requests' })
export class RequestsStore extends EntityStore<RequestsState, Request> {
  constructor() {
    super(createInitialState());
  }
}

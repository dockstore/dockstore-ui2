import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RequestsStore, RequestsState } from './requests.store';
import { Request } from './request.model';
import { Organisation, OrganisationUser } from '../../shared/swagger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsQuery extends QueryEntity<RequestsState, Request> {
  allPendingOrganizations$: Observable<Array<Organisation>> = this.select(state => state.allPendingOrganizations);
  myMemberships$: Observable<Array<OrganisationUser>> = this.select(state => state.myMemberships);
  myOrganizationInvites$: Observable<Array<OrganisationUser>> = this.select(state => state.myOrganizationInvites);
  myPendingOrganizationRequests$: Observable<Array<OrganisationUser>> = this.select(state => state.myPendingOrganizationRequests);

  constructor(protected store: RequestsStore) {
    super(store);
  }

}

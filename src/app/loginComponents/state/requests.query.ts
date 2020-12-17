import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Organization, OrganizationUser } from '../../shared/swagger';
import { Request } from './request.model';
import { RequestsState, RequestsStore } from './requests.store';

@Injectable({
  providedIn: 'root',
})
export class RequestsQuery extends QueryEntity<RequestsState, Request> {
  allPendingOrganizations$: Observable<Array<Organization>> = this.select((state) => state.allPendingOrganizations);
  myMemberships$: Observable<Array<OrganizationUser>> = this.select((state) => state.myMemberships);
  myOrganizationInvites$: Observable<Array<OrganizationUser>> = this.select((state) => state.myOrganizationInvites);
  myPendingOrganizationRequests$: Observable<Array<OrganizationUser>> = this.select((state) => state.myPendingOrganizationRequests);
  myRejectedOrganizationRequests$: Observable<Array<OrganizationUser>> = this.select((state) => state.myRejectedOrganizationRequests);
  isLoading$: Observable<boolean> = this.selectLoading();

  constructor(protected store: RequestsStore) {
    super(store);
  }
}

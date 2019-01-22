import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RequestsStore, RequestsState } from './requests.store';
import { Request } from './request.model';
import { Organisation } from '../../shared/swagger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsQuery extends QueryEntity<RequestsState, Request> {
  pendingOrganizations$: Observable<Array<Organisation>> = this.select(state => state.pendingOrganizations);

  constructor(protected store: RequestsStore) {
    super(store);
  }

}

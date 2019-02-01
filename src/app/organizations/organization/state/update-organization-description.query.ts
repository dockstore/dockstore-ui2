import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UpdateOrganizationDescriptionStore, UpdateOrganizationDescriptionState } from './update-organization-description.store';

@Injectable({ providedIn: 'root' })
export class UpdateOrganizationDescriptionQuery extends Query<UpdateOrganizationDescriptionState> {

  constructor(protected store: UpdateOrganizationDescriptionStore) {
    super(store);
  }

}

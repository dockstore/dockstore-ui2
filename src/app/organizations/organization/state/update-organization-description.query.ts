import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  UpdateOrganizationOrCollectionDescriptionStore,
  UpdateOrganizationOrCollectionDescriptionState
} from './update-organization-description.store';

@Injectable({ providedIn: 'root' })
export class UpdateOrganizationOrCollectionDescriptionQuery extends Query<UpdateOrganizationOrCollectionDescriptionState> {
  constructor(protected store: UpdateOrganizationOrCollectionDescriptionStore) {
    super(store);
  }
}

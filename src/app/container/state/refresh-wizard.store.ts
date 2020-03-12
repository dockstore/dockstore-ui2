import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface RefreshWizardState {
  organizations: string[];
  repositories: string[];
  selectedOrganization: string;
  repositoryLoading: boolean;
}

export function createInitialState(): RefreshWizardState {
  return {
    organizations: undefined,
    repositories: undefined,
    selectedOrganization: undefined,
    repositoryLoading: false
  };
}

@Injectable()
@StoreConfig({ name: 'refresh-wizard' })
export class RefreshWizardStore extends Store<RefreshWizardState> {
  constructor() {
    super(createInitialState());
  }
}

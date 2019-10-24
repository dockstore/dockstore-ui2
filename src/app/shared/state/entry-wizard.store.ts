import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Repository } from '../openapi/model/repository';

export interface EntryWizardState {
  gitRegistries: string[];
  gitOrganizations: string[];
  gitRepositories: Repository[];
}

export function createInitialState(): EntryWizardState {
  return {
    gitRegistries: undefined,
    gitOrganizations: undefined,
    gitRepositories: undefined
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entry-wizard' })
export class EntryWizardStore extends EntityStore<EntryWizardState> {
  constructor() {
    super(createInitialState());
  }
}

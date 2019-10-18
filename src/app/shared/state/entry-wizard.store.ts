import { Injectable } from '@angular/core';
import { EntryWizard } from './entry-wizard.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Repository } from '../openapi/model/repository';

export interface EntryWizardState extends EntityState<EntryWizard> {
  gitRegistries: string[];
  gitOrganizations: string[];
  gitRepositories: Repository[];
}

export function createInitialState(): EntryWizardState {
  return {
    gitRegistries: [],
    gitOrganizations: [],
    gitRepositories: []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entry-wizard' })
export class EntryWizardStore extends EntityStore<EntryWizardState> {
  constructor() {
    super(createInitialState());
  }
}

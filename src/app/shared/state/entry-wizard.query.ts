import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EntryWizardState, EntryWizardStore } from './entry-wizard.store';

@Injectable({ providedIn: 'root' })
export class EntryWizardQuery extends Query<EntryWizardState> {
  selectGitRegistries$ = this.select((state) => state.gitRegistries);
  selectGitOrganizations$ = this.select((state) => state.gitOrganizations);
  selectGitRepositories$ = this.select((state) => state.gitRepositories);

  constructor(protected store: EntryWizardStore) {
    super(store);
  }
}

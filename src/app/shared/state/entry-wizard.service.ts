import { Injectable } from '@angular/core';
import { EntryWizardStore } from './entry-wizard.store';
import { DefaultService } from '../openapi';

@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  constructor(private entryWizardStore: EntryWizardStore, private defaultService: DefaultService) {}

  updateGitRegistries() {
    this.defaultService.getUserRegistries().subscribe(
      (registries: Array<string>) => {
        this.entryWizardStore.update({ gitRegistries: registries });
        this.entryWizardStore.setLoading(false);
      },
      () => {}
    );
  }

  updateGitOrganizations(registry: string) {
    this.defaultService.getUserOrganizations('github.com').subscribe(
      (organizations: Array<string>) => {
        console.log(organizations);
        this.entryWizardStore.update({ gitOrganizations: organizations });
        this.entryWizardStore.setLoading(false);
      },
      () => {
        console.log('error');
      }
    );
  }
}

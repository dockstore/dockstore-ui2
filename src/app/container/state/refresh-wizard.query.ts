import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { RefreshWizardState, RefreshWizardStore } from './refresh-wizard.store';

@Injectable()
export class RefreshWizardQuery extends Query<RefreshWizardState> {
  organizations$: Observable<string[]> = this.select((state) => state.organizations);
  repositories$: Observable<string[]> = this.select((state) => state.repositories);
  seletedOrganization$: Observable<string> = this.select((state) => state.selectedOrganization);
  error$: Observable<HttpErrorResponse> = this.select((state) => state.error);
  constructor(protected store: RefreshWizardStore) {
    super(store);
  }
}

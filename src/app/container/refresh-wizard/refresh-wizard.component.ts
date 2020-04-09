import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenSource } from 'app/shared/enum/token-source.enum';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { RefreshWizardQuery } from '../state/refresh-wizard.query';
import { RefreshWizardService } from '../state/refresh-wizard.service';
import { RefreshWizardStore } from '../state/refresh-wizard.store';

@Component({
  selector: 'refresh-wizard',
  templateUrl: './refresh-wizard.component.html',
  styleUrls: ['./refresh-wizard.component.scss'],
  providers: [RefreshWizardQuery, RefreshWizardStore, RefreshWizardService]
})
export class RefreshWizardComponent implements OnInit {
  loading$: Observable<boolean>;
  organizations$: Observable<string[]>;
  repositories$: Observable<string[]>;
  repositoryLoading$: Observable<boolean>;
  error$: Observable<HttpErrorResponse>;

  constructor(
    private refreshWizardQuery: RefreshWizardQuery,
    private refreshWizardService: RefreshWizardService,
    private sessionQuery: SessionQuery
  ) {}

  ngOnInit() {
    this.loading$ = this.refreshWizardQuery.selectLoading();
    this.refreshWizardService.getOrganizations(TokenSource.QUAY);
    this.organizations$ = this.refreshWizardQuery.organizations$;
    this.repositories$ = this.refreshWizardQuery.repositories$;
    this.repositoryLoading$ = this.sessionQuery.loadingDialog$;
    this.error$ = this.refreshWizardQuery.error$;
  }

  selectOrganization(organization: string) {
    this.refreshWizardService.getRepositories(organization);
  }

  refreshRepository(repository: string) {
    this.refreshWizardService.refreshRepository(repository);
  }

  clearError() {
    this.refreshWizardService.setError(null);
  }
}

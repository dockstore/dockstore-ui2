import { Component, OnInit } from '@angular/core';
import { TokenSource } from 'app/shared/enum/token-source.enum';
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

  constructor(private refreshWizardQuery: RefreshWizardQuery, private refreshWizardService: RefreshWizardService) {}

  ngOnInit() {
    this.loading$ = this.refreshWizardQuery.selectLoading();
    this.refreshWizardService.getOrganizations(TokenSource.QUAY);
    this.organizations$ = this.refreshWizardQuery.organizations$;
    this.repositories$ = this.refreshWizardQuery.repositories$;
    this.repositoryLoading$ = this.refreshWizardQuery.repositoryLoading$;
  }

  refreshOrganization(organization: string) {
    this.refreshWizardService.refreshOrganization(organization);
  }

  selectOrganization(organization: string) {
    this.refreshWizardService.getRepositories(organization);
  }

  refreshRepository(repository: string) {
    this.refreshWizardService.refreshRepository(repository);
  }
}

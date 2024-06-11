import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenSource } from 'app/shared/enum/token-source.enum';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { RefreshWizardQuery } from '../state/refresh-wizard.query';
import { RefreshWizardService } from '../state/refresh-wizard.service';
import { RefreshWizardStore } from '../state/refresh-wizard.store';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-refresh-wizard',
  templateUrl: './refresh-wizard.component.html',
  styleUrls: ['./refresh-wizard.component.scss'],
  providers: [RefreshWizardQuery, RefreshWizardStore, RefreshWizardService],
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    MatLegacyCardModule,
    MatIconModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    NgFor,
    MatLegacyOptionModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    FlexModule,
    MatStepperModule,
    MatLegacyDialogModule,
    AsyncPipe,
  ],
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

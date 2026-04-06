import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenSource } from 'app/shared/enum/token-source.enum';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { RefreshWizardQuery } from '../state/refresh-wizard.query';
import { RefreshWizardService } from '../state/refresh-wizard.service';
import { RefreshWizardStore } from '../state/refresh-wizard.store';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatButtonModule,
    MatTooltipModule,
    FlexModule,
    MatStepperModule,
    MatDialogModule,
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

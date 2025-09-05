import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Base } from 'app/shared/base';
import { Repository, WorkflowsService } from 'app/shared/openapi';
import { CodeEditorComponent } from '../shared/code-editor/code-editor.component';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { EntryWizardQuery } from 'app/shared/state/entry-wizard.query';
import { EntryWizardService } from 'app/shared/state/entry-wizard.service';
import { Observable } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dockstore-yml-generator',
  templateUrl: './dockstore-yml-generator.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    FlexModule,
    MatCardModule,
    CodeEditorComponent,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    AsyncPipe,
    NgFor,
    MatProgressBar,
    AlertComponent,
  ],
})
export class DockstoreYmlGeneratorComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  isLoading$: Observable<boolean>;
  gitRegistries$: Observable<string[]>;
  gitOrganizations$: Observable<string[]>;
  gitRepositories$: Observable<Repository[]>;
  selectedGitRegistry: string = 'github.com';
  selectedOrganization: string = undefined;
  selectedRepository?: string;
  gitHubReferenceForInference: string;
  generatedDockstoreYml: string;
  createFileOnGitHubLink: string;
  isGeneratedDockstoreYmlLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private entryWizardQuery: EntryWizardQuery,
    private entryWizardService: EntryWizardService,
    private workflowsService: WorkflowsService,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.selectedOrganization = params.organization;
      this.selectedRepository = params.repository;
    });

    if (!this.selectedOrganization && !this.selectedRepository) {
      this.isLoading$ = this.entryWizardQuery.selectLoading();
    }
    this.entryWizardService.updateGitOrganizationStore('github.com');
    this.gitOrganizations$ = this.entryWizardQuery.selectGitOrganizations$;
    if (this.selectedOrganization) {
      this.entryWizardService.updateGitRepositoryStore(this.selectedGitRegistry, this.selectedOrganization);
    }
    this.gitRepositories$ = this.entryWizardQuery.selectGitRepositories$.pipe(
      map((repositories) => {
        if (repositories) {
          repositories.sort((a, b) => a.repositoryName.localeCompare(b.repositoryName));
          return repositories;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Given a registry will retrieve all associated organizations for the logged in user
   * @param selectedRegistry the selected registry
   */
  getOrganizations(selectedRegistry: string) {
    this.entryWizardService.updateGitOrganizationStore(selectedRegistry);
  }

  /**
   * Given an organization will retrieve all associated repositories for the logged in user
   * @param selectedOrganization the selected organization
   */
  getRepositories(selectedOrganization: string) {
    this.entryWizardService.updateGitRepositoryStore(this.selectedGitRegistry, selectedOrganization);
    this.selectedRepository = null;
    this.generatedDockstoreYml = null;
  }

  resetGeneratedDockstoreYml() {
    this.generatedDockstoreYml = null;
    this.gitHubReferenceForInference = null;
    this.createFileOnGitHubLink = null;
  }

  generateDockstoreYml() {
    this.isGeneratedDockstoreYmlLoading = true;
    this.workflowsService
      .inferEntries(this.selectedOrganization, this.selectedRepository)
      .pipe(
        finalize(() => (this.isGeneratedDockstoreYmlLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (inferredDockstoreYml) => {
          this.gitHubReferenceForInference = inferredDockstoreYml.gitReference;
          this.generatedDockstoreYml = inferredDockstoreYml.dockstoreYml;
          this.createFileOnGitHubLink = `https://github.com/${this.selectedOrganization}/${this.selectedRepository}/new/${
            this.gitHubReferenceForInference
          }?filename=.dockstore.yml&value=${encodeURIComponent(this.generatedDockstoreYml)}`;
        },
        (error) => {
          this.alertService.detailedError(error);
        }
      );
  }
}

import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';
import {
  AliasesService as WorkflowVersionsAliasService,
  Collection,
  ContainersService,
  EntriesService,
  Entry,
  Organization,
  OrganizationsService,
  Workflow,
  WorkflowsService,
  WorkflowVersionPathInfo,
} from '../../shared/openapi';
import { AliasesStore } from './aliases.store';

@Injectable({ providedIn: 'root' })
export class AliasesService {
  constructor(
    private aliasesStore: AliasesStore,
    private organizationsService: OrganizationsService,
    private entriesService: EntriesService,
    private workflowsService: WorkflowsService,
    private workflowVersionsService: WorkflowVersionsAliasService
  ) {}

  clearState(): void {
    this.aliasesStore.update((state) => {
      return {
        ...state,
        organization: null,
        entry: null,
        workflowVersion: null,
      };
    });
  }

  @transaction()
  updateOrganizationFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.organizationsService
      .getOrganizationByAlias(alias)
      .pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe(
        (organization: Organization) => {
          this.aliasesStore.setError(false);
          this.updateOrganization(organization);
        },
        () => {
          this.aliasesStore.setError(true);
        }
      );
  }

  updateOrganization(organization: Organization) {
    this.aliasesStore.update((state) => {
      return {
        ...state,
        organization: organization,
      };
    });
  }

  @transaction()
  updateCollectionFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.organizationsService
      .getCollectionByAlias(alias)
      .pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe(
        (collection: Collection) => {
          this.aliasesStore.setError(false);
          this.updateCollection(collection);
        },
        () => {
          this.aliasesStore.setError(true);
        }
      );
  }

  updateCollection(collection: Collection) {
    this.aliasesStore.update((state) => {
      return {
        ...state,
        collection: collection,
      };
    });
  }

  @transaction()
  updateEntryFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.entriesService
      .getEntryByAlias(alias)
      .pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe(
        (entry: Entry) => {
          this.aliasesStore.setError(false);
          this.updateEntry(entry);
        },
        () => {
          this.aliasesStore.setError(true);
        }
      );
  }

  updateEntry(entry: Entry) {
    this.aliasesStore.update((state) => {
      return {
        ...state,
        entry: entry,
      };
    });
  }

  @transaction()
  updateWorkflowVersionPathInfoFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.workflowVersionsService
      .getWorkflowVersionPathInfoByAlias(alias)
      .pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe(
        (workflowVersionPathInfo: WorkflowVersionPathInfo) => {
          this.aliasesStore.setError(false);
          this.updateWorkflowVersionPathInfo(workflowVersionPathInfo);
        },
        () => {
          this.aliasesStore.setError(true);
        }
      );
  }

  updateWorkflowVersionPathInfo(workflowVersionPathInfo: WorkflowVersionPathInfo) {
    this.aliasesStore.update((state) => {
      return {
        ...state,
        workflowVersionPathInfo: workflowVersionPathInfo,
      };
    });
  }
}

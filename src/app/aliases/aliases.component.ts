import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { Collection, DockstoreTool, Entry, Organization, Workflow, WorkflowVersionPathInfo } from '../shared/openapi';
import { ActivatedRoute, Router } from '../test';
import { AliasesQuery } from './state/aliases.query';
import { AliasesService } from './state/aliases.service';
import { EntryTypeMetadataService } from '../entry/type-metadata/entry-type-metadata.service';
import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-aliases',
  templateUrl: './aliases.component.html',
  styleUrls: ['./aliases.component.scss'],
  standalone: true,
  imports: [HeaderComponent, NgIf, MatLegacyCardModule, MatIconModule, MatLegacyProgressBarModule, AsyncPipe],
})
export class AliasesComponent extends Base implements OnInit {
  loading$: Observable<boolean>;
  public type: string | null;
  public alias: string | null;
  public validType: boolean;
  public found: boolean;
  constructor(
    private aliasesQuery: AliasesQuery,
    private aliasesService: AliasesService,
    private entryTypeMetadataService: EntryTypeMetadataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.loading$ = this.aliasesQuery.loading$;
    this.type = this.normalizeType(this.route.snapshot.paramMap.get('type'));
    this.alias = this.route.snapshot.paramMap.get('alias');
    if (this.type === 'organizations') {
      this.validType = true;
      this.aliasesService.updateOrganizationFromAlias(this.alias);
      this.navigateTo(this.aliasesQuery.organization$, (organization: Organization) => ['/organizations', organization.name]);
    } else if (this.type === 'collections') {
      this.validType = true;
      this.aliasesService.updateCollectionFromAlias(this.alias);
      this.navigateTo(this.aliasesQuery.collection$, (collection: Collection) => [
        '/organizations',
        collection.organizationName,
        'collections',
        collection.name,
      ]);
    } else if (this.versionTypes().includes(this.type)) {
      this.validType = true;
      this.aliasesService.updateWorkflowVersionPathInfoFromAlias(this.alias);
      this.navigateTo(
        this.aliasesQuery.workflowVersionPathInfo$,
        (info: WorkflowVersionPathInfo) => [info.entryTypeMetadata.sitePath, info.fullWorkflowPath + ':' + info.tagName],
        (info: WorkflowVersionPathInfo) => info.entryTypeMetadata.term === this.type.split('-')[0]
      );
    } else if (this.entryTypes().includes(this.type)) {
      this.validType = true;
      this.aliasesService.updateEntryFromAlias(this.alias);
      this.navigateTo(
        this.aliasesQuery.entry$,
        (entry: Entry) => [entry.entryTypeMetadata.sitePath, this.getPath(entry)],
        (entry: Entry) => entry.entryTypeMetadata.termPlural === this.type
      );
    }
  }

  private normalizeType(type: string): string {
    if (type === 'containers') {
      return 'tools';
    }
    if (type === 'container-versions') {
      return 'tool-versions';
    }
    return type;
  }

  /**
   * Calculate the list of possible version alias types.
   * By convention, there is a version alias type for each Entry type, denoted by the term for the Entry type concatenated with '-versions'.
   * For example, the alias type for a Workflow version is 'workflow-versions'.
   */
  private versionTypes(): string[] {
    return this.entryTypeMetadataService.getAll().map((metadata) => `${metadata.term}-versions`);
  }

  /**
   * Calculate the list of possible entry alias types.
   * By convention, there is an entry alias type for each Entry type, denoted by the plural term for the Entry type.
   * For example, the alias type for a Workflow is 'workflows'.
   */
  private entryTypes(): string[] {
    return this.entryTypeMetadataService.getAll().map((metadata) => metadata.termPlural);
  }

  private getPath(entry: Entry): string {
    return (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path;
  }

  /**
   * Add a subscription to the specified Observable which will navigate to the entity that it produces.
   * An "entity" is an Organization, Collection, Entry, etc.
   * The specified functions calculate the absolute path and visibility of the entity.
   * @param entity$ - Observable that will produce the entity
   * @param entityToPath - Function that maps the entity to its absolute path
   * @param entityIsVisible - Function that determines whether the entity is visible
   */
  private navigateTo<EntityType>(
    entity$: Observable<EntityType>,
    entityToPath: (entity: EntityType) => string[],
    entityIsVisible: (entity: EntityType) => boolean = () => true
  ): void {
    entity$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entity: EntityType | null) => {
      if (entity && entityIsVisible(entity)) {
        const path = entityToPath(entity);
        this.router.navigate(path);
        this.found = true;
      } else {
        this.found = false;
      }
    });
  }
}

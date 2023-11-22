import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { Collection, DockstoreTool, Entry, Organization, Workflow, WorkflowVersionPathInfo } from '../shared/openapi';
import { ActivatedRoute, Router } from '../test';
import { AliasesQuery } from './state/aliases.query';
import { AliasesService } from './state/aliases.service';

@Component({
  selector: 'app-aliases',
  templateUrl: './aliases.component.html',
  styleUrls: ['./aliases.component.scss'],
})
export class AliasesComponent extends Base implements OnInit {
  loading$: Observable<boolean>;
  public type: string | null;
  public alias: string | null;
  public validType: boolean;
  public aliasNotFound: boolean;
  constructor(
    private aliasesQuery: AliasesQuery,
    private aliasesService: AliasesService,
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
    } else if (
      this.type === 'workflow-versions' ||
      this.type === 'tool-versions' ||
      this.type === 'service-versions' ||
      this.type === 'notebook-versions'
    ) {
      this.validType = true;
      this.aliasesService.updateWorkflowVersionPathInfoFromAlias(this.alias);
      this.navigateTo(
        this.aliasesQuery.workflowVersionPathInfo$,
        (info: WorkflowVersionPathInfo) => [info.entryTypeMetadata.sitePath, info.fullWorkflowPath + ':' + info.tagName],
        (info: WorkflowVersionPathInfo) => info.entryTypeMetadata.term === this.type.split('-')[0]
      );
    } else if (this.type === 'workflows' || this.type === 'tools' || this.type === 'services' || this.type === 'notebooks') {
      this.validType = true;
      this.aliasesService.updateEntryFromAlias(this.alias);
      this.navigateTo(
        this.aliasesQuery.entry$,
        (entry: Entry) => [entry.entryTypeMetadata.sitePath, this.getPath(entry)],
        (entry: Entry) => entry.entryTypeMetadata.termPlural === this.type
      );
    } else {
      this.validType = false;
    }
  }

  private normalizeType(type: string): string {
    if (type === 'containers') {
      return 'tools';
    }
    return type;
  }

  private getPath(entry: Entry): string {
    return (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path;
  }

  private navigateTo<EntityType>(
    entity$: Observable<EntityType>,
    entityToPath: (entity: EntityType) => string[],
    entityFilter: (entity: EntityType) => boolean = () => true
  ): void {
    entity$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entity: EntityType | null) => {
      if (entity && entityFilter(entity)) {
        const path = entityToPath(entity);
        this.router.navigate(path);
        this.aliasNotFound = false;
      } else {
        this.aliasNotFound = true;
      }
    });
  }
}

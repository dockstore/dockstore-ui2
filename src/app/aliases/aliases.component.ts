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
  organization$: Observable<Organization | null>;
  collection$: Observable<Collection | null>;
  entry$: Observable<Entry | null>;
  workflowVersionPathInfo$: Observable<WorkflowVersionPathInfo | null>;
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
    this.type = this.route.snapshot.paramMap.get('type');
    this.alias = this.route.snapshot.paramMap.get('alias');
    this.validType = false;
    if (this.type === 'organizations') {
      this.aliasesService.updateOrganizationFromAlias(this.alias);
      this.organization$ = this.aliasesQuery.organization$;
      this.navigateTo(this.organization$, (organization: Organization) => ['/organizations', organization.name]);
    }
    if (this.type === 'collections') {
      this.aliasesService.updateCollectionFromAlias(this.alias);
      this.collection$ = this.aliasesQuery.collection$;
      this.navigateTo(this.collection$, (collection: Collection) => [
        '/organizations',
        collection.organizationName,
        'collections',
        collection.name,
      ]);
    }
    if (
      this.type === 'workflow-versions' ||
      this.type === 'tool-versions' ||
      this.type === 'service-versions' ||
      this.type === 'notebook-versions'
    ) {
      this.aliasesService.updateWorkflowVersionPathInfoFromAlias(this.alias);
      this.workflowVersionPathInfo$ = this.aliasesQuery.workflowVersionPathInfo$;
      this.navigateTo(this.workflowVersionPathInfo$, (info: WorkflowVersionPathInfo) => [
        info.entryTypeMetadata.sitePath,
        info.fullWorkflowPath + ':' + info.tagName,
      ]);
    }
    if (this.type === 'workflows' || this.type === 'tools' || this.type === 'services' || this.type === 'notebooks') {
      this.aliasesService.updateEntryFromAlias(this.alias);
      this.entry$ = this.aliasesQuery.entry$;
      this.navigateTo(this.entry$, (entry: Entry) => [entry.entryTypeMetadata.sitePath, this.getPath(entry)]);
    }
  }

  private getPath(entry: Entry): string {
    return (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path;
  }

  private navigateTo<EntityType>(entity$: Observable<EntityType>, entityToPath: (entity: EntityType) => string[]): void {
    this.validType = true;
    entity$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entity: EntityType | null) => {
      if (entity) {
        const path = entityToPath(entity);
        this.router.navigate(path);
      }
      this.aliasNotFound = !entity;
    });
  }
}

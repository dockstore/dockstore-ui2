import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { Collection, Entry, Organization, WorkflowVersionPathInfo } from '../shared/openapi';
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
  aliasNotFound$: Observable<boolean>;
  public type: string | null;
  public alias: string | null;
  public validType: boolean;
  // Types contains resource types that support aliases
  // public types = ['organizations', 'collections', 'workflows', 'tools', 'containers', 'workflow-versions'];
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
    // TODO check alias and type
    if (this.type === 'organizations') {
      this.aliasesService.updateOrganizationFromAlias(this.alias);
      this.organization$ = this.aliasesQuery.organization$;
      this.organization$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((organization: Organization) => {
        if (organization) {
          this.router.navigate(['/organizations', organization.name]);
        }
        this.aliasNotFound$ = this.organization$.pipe(map((tool) => !tool));
      });
    }
    if (this.type === 'collections') {
      this.aliasesService.updateCollectionFromAlias(this.alias);
      this.collection$ = this.aliasesQuery.collection$;
      this.collection$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((collection: Collection) => {
        if (collection) {
          this.router.navigate(['/organizations', collection.organizationName, 'collections', collection.name]);
        }
        this.aliasNotFound$ = this.collection$.pipe(map((tool) => !tool));
      });
    }
    if (
      this.type === 'workflow-versions' ||
      this.type === 'tool-versions' ||
      this.type === 'service-versions' ||
      this.type === 'notebook-versions'
    ) {
      this.aliasesService.updateWorkflowVersionPathInfoFromAlias(this.alias);
      this.workflowVersionPathInfo$ = this.aliasesQuery.workflowVersionPathInfo$;
      this.workflowVersionPathInfo$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflowVersionPathInfo: WorkflowVersionPathInfo) => {
        if (workflowVersionPathInfo) {
          this.router.navigate(['/workflows', workflowVersionPathInfo.fullWorkflowPath + ':' + workflowVersionPathInfo.tagName]);
        }
        this.aliasNotFound$ = this.workflowVersionPathInfo$.pipe(map((tool) => !tool));
      });
    }
    if (this.type === 'workflows' || this.type === 'tools' || this.type === 'services' || this.type === 'notebooks') {
      this.aliasesService.updateEntryFromAlias(this.alias);
      this.entry$ = this.aliasesQuery.entry$;
      this.entry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entry: Entry) => {
        if (entry) {
          // check if aliastype equals type
          this.router.navigate(['/workflows', this.getPath(entry)]);
        }
        this.aliasNotFound$ = this.entry$.pipe(map((tool) => !tool));
      });
    }
  }

  getPath(entry: Entry): string {
    // TODO fill
  }
}

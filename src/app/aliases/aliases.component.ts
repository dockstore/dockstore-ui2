import { Component, OnInit } from '@angular/core';
import { AliasesService } from './state/aliases.service';
import { AliasesQuery } from './state/aliases.query';
import { ActivatedRoute, Router } from '../test';
import { Observable } from 'rxjs';
import { Organization, Collection, Workflow, DockstoreTool } from '../shared/swagger';
import { Base } from '../shared/base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'aliases',
  templateUrl: './aliases.component.html',
  styleUrls: ['./aliases.component.scss']
})
export class AliasesComponent extends Base implements OnInit {
  loading$: Observable<boolean>;
  organization$: Observable<Organization | null>;
  collection$: Observable<Collection | null>;
  workflow$: Observable<Workflow | null>;
  tool$: Observable<DockstoreTool | null>;

  public type: string | null;
  public alias: string | null;
  public validType: boolean;
  // Types contains resource types that support aliases
  public types = ['organizations', 'collections', 'workflows', 'tools', 'containers'];
  constructor(
    private aliasesQuery: AliasesQuery,
    private aliasesService: AliasesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.alias = this.route.snapshot.paramMap.get('alias');
    this.validType = this.type ? this.types.includes(this.type) : false;
    this.loading$ = this.aliasesQuery.loading$;

    if (this.type === 'organizations' && this.alias) {
      this.aliasesService.updateOrganizationFromAlias(this.alias);
      this.organization$ = this.aliasesQuery.organization$;
      this.organization$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((organization: Organization) => {
        if (organization) {
          this.router.navigate(['/organizations', organization.name]);
        }
      });
    } else if (this.type === 'collections' && this.alias) {
      this.aliasesService.updateCollectionFromAlias(this.alias);
      this.collection$ = this.aliasesQuery.collection$;
      this.collection$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((collection: Collection) => {
        if (collection) {
          this.router.navigate(['/organizations', collection.organizationName, 'collections', collection.name]);
        }
      });
    } else if (this.type === 'workflows' && this.alias) {
      this.aliasesService.updateWorkflowFromAlias(this.alias);
      this.workflow$ = this.aliasesQuery.workflow$;
      this.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Workflow) => {
        if (workflow) {
          this.router.navigate(['/workflows', workflow.full_workflow_path]);
        }
      });
    } else if ((this.type === 'tools' || this.type === 'containers') && this.alias) {
      this.aliasesService.updateToolFromAlias(this.alias);
      this.tool$ = this.aliasesQuery.tool$;
      this.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool: DockstoreTool) => {
        if (tool) {
          this.router.navigate(['/tools', tool.tool_path]);
        }
      });
    }
  }
}

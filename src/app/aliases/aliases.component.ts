import { Component, OnInit } from '@angular/core';
import { AliasesService } from './state/aliases.service';
import { AliasesQuery } from './state/aliases.query';
import { ActivatedRoute, Router } from '../test';
import { Observable } from 'rxjs';
import { Organization, Collection } from '../shared/swagger';
import { Base } from '../shared/base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'aliases',
  templateUrl: './aliases.component.html',
  styleUrls: ['./aliases.component.scss']
})
export class AliasesComponent extends Base implements OnInit {

  loading$: Observable<boolean>;
  organization$: Observable<Organization>;
  collection$: Observable<Collection>;

  public type: string | null;
  public alias: string | null;
  public validType: boolean;
  // Types contains resource types that support aliases
  public types = [ 'organizations', 'collections' ];
  constructor(private aliasesQuery: AliasesQuery,
              private aliasesService: AliasesService,
              private route: ActivatedRoute,
              private router: Router
  ) {
    super();
  }

  ngOnInit() {
    /*
    let myType: string | null;
    myType = this.route.snapshot.paramMap.get('type') ;
    // Avoid assigning null to this.type
    this.type = (myType) ? myType : '';
     */
    this.type = this.route.snapshot.paramMap.get('type') ;
    this.alias = this.route.snapshot.paramMap.get('alias');
    this.validType = (this.type) ? this.types.includes(this.type) : false;
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
    }
  }
}

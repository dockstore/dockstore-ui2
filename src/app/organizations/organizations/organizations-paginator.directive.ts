import { Directive, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { Organization } from '../../shared/swagger';
import { OrganizationsQuery } from '../state/organizations.query';
import { OrganizationsStateService } from '../state/organizations.service';

@Directive()
export abstract class OrganizationsPaginatorDirective extends Base implements OnInit  {
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  abstract dataSource: MatTableDataSource<Organization>;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  abstract privateNgOnInit(): Observable<Array<Organization>>;

  constructor(protected organizationsQuery: OrganizationsQuery, protected organizationsStateService: OrganizationsStateService) {
    super();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    combineLatest([this.organizationsQuery.pageSize$, this.organizationsQuery.pageIndex$, this.privateNgOnInit()])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pageSize, pageIndex, entries]) => {
        this.dataSource.paginator.pageSize = pageSize;
        this.dataSource.paginator.pageIndex = pageIndex;
        // Must set data after paginator, just a material datatables thing.
        this.dataSource.data = entries || [];
      });
  }

  updatePageSizeAndIndex($event: PageEvent) {
    this.organizationsStateService.setPageSizeAndIndex($event.pageSize, $event.pageIndex);
  }
}

import { AfterViewInit, OnDestroy, Component, OnInit } from '@angular/core';
import { PublishedOrganisationsDataSource } from './published-organisations.datasource';
import { OrganisationsService } from '../../shared/swagger';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-organisations',
  templateUrl: './list.component.html',
  styles: [ './list.component.css' ]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<{}> = new Subject();
  public dataSource: PublishedOrganisationsDataSource;

  constructor(private organisationsService: OrganisationsService) {
  }

  ngOnInit() {
    this.dataSource = new PublishedOrganisationsDataSource(this.organisationsService);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadPublishedEntries();
    });
  }

  loadPublishedEntries() {
    this.dataSource.loadEntries();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

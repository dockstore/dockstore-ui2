import { ListContainersService } from './../containers/list/list.service';
import { SearchStubService, ListContainersStubService } from './../test/service-stubs';
import { SearchService } from './../search/search.service';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterLinkStubDirective } from './../test/router-stubs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DockstoreService } from '../shared/dockstore.service';

import { ListentryComponent } from './listentry.component';

describe('ListentryComponent', () => {
  let component: ListentryComponent;
  let fixture: ComponentFixture<ListentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListentryComponent,
      RouterLinkStubDirective ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ DataTablesModule.forRoot(), ClipboardModule ],
      providers: [
        { provide: SearchService, useClass: SearchStubService },
        { provide: ListContainersService, useClass: ListContainersStubService },
        { provide: DockstoreService, useClass: SearchStubService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

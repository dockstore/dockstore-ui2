/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterTestingModule } from '@angular/router/testing';
import { ListContainersService } from '../../containers/list/list.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { DockstoreStubService, ListContainersStubService, SearchStubService } from '../../test/service-stubs';
import { SearchService } from '../state/search.service';
import { SearchToolTableComponent } from './search-tool-table.component';

describe('SearchToolTableComponent', () => {
  let component: SearchToolTableComponent;
  let fixture: ComponentFixture<SearchToolTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchToolTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CustomMaterialModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [
        { provide: DockstoreService, useClass: DockstoreStubService },
        DateService,
        { provide: ListContainersService, useClass: ListContainersStubService },
        { provide: SearchService, useClass: SearchStubService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchToolTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

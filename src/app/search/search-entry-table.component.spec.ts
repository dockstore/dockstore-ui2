/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DockstoreService } from '../shared/dockstore.service';
import { DockstoreStubService, QueryBuilderStubService, SearchStubService } from '../test/service-stubs';
import { SearchService } from './state/search.service';
import { SearchEntryTableComponent } from './search-entry-table.component';
import { EntryType } from 'app/shared/openapi';
import { QueryBuilderService } from './query-builder.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SearchEntryTableComponent', () => {
  let component: SearchEntryTableComponent;
  let fixture: ComponentFixture<SearchEntryTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [BrowserAnimationsModule, RouterTestingModule, SearchEntryTableComponent],
        providers: [
          { provide: DockstoreService, useClass: DockstoreStubService },
          { provide: SearchService, useClass: SearchStubService },
          { provide: QueryBuilderService, useClass: QueryBuilderStubService },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEntryTableComponent);
    component = fixture.componentInstance;
    component.entryType = EntryType.WORKFLOW;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

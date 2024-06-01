/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DockstoreStubService, SearchStubService } from '../../test/service-stubs';
import { SearchService } from '../state/search.service';
import { SearchNotebookTableComponent } from './search-notebook-table.component';

describe('SearchNotebookTableComponent', () => {
  let component: SearchNotebookTableComponent;
  let fixture: ComponentFixture<SearchNotebookTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [BrowserAnimationsModule, RouterTestingModule, SearchNotebookTableComponent],
        providers: [
          { provide: DockstoreService, useClass: DockstoreStubService },
          DateService,
          { provide: SearchService, useClass: SearchStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNotebookTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

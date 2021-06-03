/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchToolTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

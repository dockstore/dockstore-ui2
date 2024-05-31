/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { DockstoreStubService, SearchStubService } from '../../test/service-stubs';
import { SearchService } from '../state/search.service';
import { SearchWorkflowTableComponent } from './search-workflow-table.component';

describe('SearchWorkflowTableComponent', () => {
  let component: SearchWorkflowTableComponent;
  let fixture: ComponentFixture<SearchWorkflowTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [CustomMaterialModule, BrowserAnimationsModule, RouterTestingModule, SearchWorkflowTableComponent],
        providers: [
          { provide: DockstoreService, useClass: DockstoreStubService },
          DateService,
          { provide: SearchService, useClass: SearchStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorkflowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

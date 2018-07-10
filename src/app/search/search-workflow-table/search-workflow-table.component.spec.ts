/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchWorkflowTableComponent } from './search-workflow-table.component';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { DockstoreService } from '../../shared/dockstore.service';
import { DockstoreStubService, SearchStubService } from '../../test/service-stubs';
import { DateService } from '../../shared/date.service';
import { SearchService } from '../search.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchWorkflowTableComponent', () => {
  let component: SearchWorkflowTableComponent;
  let fixture: ComponentFixture<SearchWorkflowTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWorkflowTableComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CustomMaterialModule, BrowserAnimationsModule],
      providers: [{provide: DockstoreService, useClass: DockstoreStubService}, DateService,
      {provide: SearchService, useClass: SearchStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorkflowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

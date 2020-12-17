/* tslint:disable:no-unused-variable */
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchWorkflowTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CustomMaterialModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [
        { provide: DockstoreService, useClass: DockstoreStubService },
        DateService,
        { provide: SearchService, useClass: SearchStubService },
      ],
    }).compileComponents();
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

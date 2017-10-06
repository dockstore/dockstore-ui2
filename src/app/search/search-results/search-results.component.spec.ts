import { QueryBuilderService } from './../query-builder.service';
import { SearchStubService, QueryBuilderStubService } from './../../test/service-stubs';
import { SearchService } from './../search.service';
import { FormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module/dist';
import { TabsModule } from 'ngx-bootstrap/tabs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TabsModule.forRoot(), TagCloudModule],
      providers: [
        {provide: SearchService, useClass: SearchStubService},
        { provide: QueryBuilderService, useClass: QueryBuilderStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

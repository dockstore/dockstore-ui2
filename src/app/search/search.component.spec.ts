import { AdvancedSearchStubService } from './../test/service-stubs';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { SearchStubService } from '../test/service-stubs';
import { SearchService } from './search.service';
import { ProviderService } from './../shared/provider.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ProviderService, {provide: SearchService, useClass: SearchStubService },
      {provide: AdvancedSearchService, useClass: AdvancedSearchStubService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

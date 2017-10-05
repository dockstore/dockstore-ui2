import { AccordionModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { ProviderService } from '../shared/provider.service';
import { QueryBuilderStubService, SearchStubService, AdvancedSearchStubService } from './../test/service-stubs';
import { QueryBuilderService } from './query-builder.service';
import { SearchService } from './search.service';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module/dist';
import { TabsModule } from 'ngx-bootstrap/tabs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, AccordionModule.forRoot()],
      providers: [
        {provide: SearchService, useClass: SearchStubService},
        { provide: QueryBuilderService, useClass: QueryBuilderStubService },
        ProviderService,
        { provide: AdvancedSearchService, useClass: AdvancedSearchStubService}
      ]
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

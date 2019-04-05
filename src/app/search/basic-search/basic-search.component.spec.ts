/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { ProviderService } from '../../shared/provider.service';
import { AdvancedSearchStubService } from '../../test/service-stubs';
import { AdvancedSearchService } from '../advancedsearch/advanced-search.service';
import { BasicSearchComponent } from './basic-search.component';

describe('BasicSearchComponent', () => {
  let component: BasicSearchComponent;
  let fixture: ComponentFixture<BasicSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ MatAutocompleteModule, RouterTestingModule],
      declarations: [ BasicSearchComponent ],
      providers: [
        ProviderService,
        { provide: AdvancedSearchService, useClass: AdvancedSearchStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

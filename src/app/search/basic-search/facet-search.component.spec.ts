/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { ProviderService } from '../../shared/provider.service';
import { SearchStubService } from '../../test/service-stubs';
import { SearchService } from '../state/search.service';
import { FacetSearchComponent } from './facet-search.component';

describe('FacetSearchComponent', () => {
  let component: FacetSearchComponent;
  let fixture: ComponentFixture<FacetSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule, RouterTestingModule, BrowserAnimationsModule, CustomMaterialModule],
      declarations: [FacetSearchComponent],
      providers: [ProviderService, { provide: SearchService, useClass: SearchStubService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

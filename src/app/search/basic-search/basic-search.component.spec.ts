/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { BasicSearchComponent } from './basic-search.component';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { AdvancedSearchStubService } from '../../test/service-stubs';
import { AdvancedSearchService } from '../advancedsearch/advanced-search.service';
import { ProviderService } from '../../shared/provider.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('BasicSearchComponent', () => {
  let component: BasicSearchComponent;
  let fixture: ComponentFixture<BasicSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule],
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

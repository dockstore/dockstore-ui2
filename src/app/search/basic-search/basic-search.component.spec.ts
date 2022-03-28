/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { ProviderService } from '../../shared/provider.service';
import { SearchStubService } from '../../test/service-stubs';
import { SearchService } from '../state/search.service';
import { BasicSearchComponent } from './basic-search.component';

describe('BasicSearchComponent', () => {
  let component: BasicSearchComponent;
  let fixture: ComponentFixture<BasicSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [MatAutocompleteModule, RouterTestingModule, BrowserAnimationsModule, CustomMaterialModule],
        declarations: [BasicSearchComponent],
        providers: [ProviderService, { provide: SearchService, useClass: SearchStubService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

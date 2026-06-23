/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { EntryCategoriesComponent } from './entry-categories.component';
import { CategorySummary, EntryType } from 'app/shared/openapi';

function cat(name: string, displayName: string): CategorySummary {
  return { name, displayName } as CategorySummary;
}

describe('EntryCategoriesComponent', () => {
  let component: EntryCategoriesComponent;
  let fixture: ComponentFixture<EntryCategoriesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, EntryCategoriesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCategoriesComponent);
    component = fixture.componentInstance;
    component.entryType = EntryType.WORKFLOW;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles empty input without error', () => {
    component.categories = [];
    component.ngOnChanges();
    expect(component['groups']).toEqual([]);
  });

  it('groups categories by name prefix', () => {
    component.categories = [
      cat('my-category', 'My Category'),
      cat('operation-alignment', 'Alignment'),
      cat('topic-genomics', 'Genomics'),
      cat('input-format-bam', 'BAM'),
      cat('input-data-reads', 'Reads'),
      cat('output-format-vcf', 'VCF'),
      cat('output-data-variants', 'Variants'),
    ];
    component.ngOnChanges();

    const labels = component['groups'].map((g) => g.label);
    expect(labels).toEqual(['Categories', 'Operations', 'Topics', 'Inputs', 'Outputs']);
  });

  it('omits empty groups', () => {
    component.categories = [cat('operation-alignment', 'Alignment')];
    component.ngOnChanges();

    const labels = component['groups'].map((g) => g.label);
    expect(labels).toEqual(['Operations']);
  });

  it('sorts non-IO categories alphabetically by displayName', () => {
    component.categories = [cat('operation-variant-calling', 'Variant Calling'), cat('operation-alignment', 'Alignment')];
    component.ngOnChanges();

    const names = component['groups'][0].categories.map((c) => c.displayName);
    expect(names).toEqual(['Alignment', 'Variant Calling']);
  });

  it('sorts IO categories with formats before data, each sorted alphabetically', () => {
    component.categories = [
      cat('input-data-reads', 'Reads'),
      cat('input-format-cram', 'CRAM'),
      cat('input-data-alignments', 'Alignments'),
      cat('input-format-bam', 'BAM'),
    ];
    component.ngOnChanges();

    const names = component['groups'][0].categories.map((c) => c.displayName);
    expect(names).toEqual(['BAM', 'CRAM', 'Alignments', 'Reads']);
  });

  it('sorts output formats before output data', () => {
    component.categories = [cat('output-data-variants', 'Variants'), cat('output-format-vcf', 'VCF')];
    component.ngOnChanges();

    const names = component['groups'][0].categories.map((c) => c.displayName);
    expect(names).toEqual(['VCF', 'Variants']);
  });
});

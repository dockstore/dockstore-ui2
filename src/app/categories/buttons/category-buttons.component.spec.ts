/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { CategoryButtonsComponent } from './category-buttons.component';
import { CategorySummary, EntryType } from 'app/shared/openapi';

function cat(name: string, displayName: string): CategorySummary {
  return { name, displayName } as CategorySummary;
}

describe('CategoryButtonsComponent', () => {
  let component: CategoryButtonsComponent;
  let fixture: ComponentFixture<CategoryButtonsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, CategoryButtonsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryButtonsComponent);
    component = fixture.componentInstance;
    component.entryType = EntryType.WORKFLOW;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles empty input without error', () => {
    component.categories = [];
    fixture.detectChanges();
    expect(component.categories).toEqual([]);
  });

  it('accepts a list of categories', () => {
    component.categories = [cat('operation-alignment', 'Alignment'), cat('topic-genomics', 'Genomics')];
    fixture.detectChanges();
    expect(component.categories.length).toBe(2);
  });
});

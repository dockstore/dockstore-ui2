import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryCategoriesComponent } from './entry-categories.component';
import { EntryType } from 'app/shared/openapi';
import { GROUP_ORDER } from 'app/categories/extract-categories.pipe';

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

  it('exposes groupOrder matching GROUP_ORDER', () => {
    expect(component['groupOrder']).toEqual(GROUP_ORDER);
  });
});

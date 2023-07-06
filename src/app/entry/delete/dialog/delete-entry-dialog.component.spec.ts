import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { EntriesService } from '../../../shared/openapi';
import { EntriesStubService } from '../../../test/service-stubs';
import { DeleteEntryDialogComponent } from './delete-entry-dialog.component';

describe('DeleteEntryDialogComponent', () => {
  let component: DeleteEntryDialogComponent;
  let fixture: ComponentFixture<DeleteEntryDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeleteEntryDialogComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [CustomMaterialModule],
        providers: [
          { provide: EntriesService, useClass: EntriesStubService },
          {
            provide: MatDialogRef,
            useValue: {
              close: (dialogResult: any) => {},
            },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { entryTypeMetadata: { term: 'workflow' } }, // simulation of an Entry
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

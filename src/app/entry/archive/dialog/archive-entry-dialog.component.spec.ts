import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EntriesService } from '../../../shared/openapi';
import { EntriesStubService } from '../../../test/service-stubs';
import { ArchiveEntryDialogComponent } from './archive-entry-dialog.component';

describe('ArchiveEntryDialogComponent', () => {
  let component: ArchiveEntryDialogComponent;
  let fixture: ComponentFixture<ArchiveEntryDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [ArchiveEntryDialogComponent, MatSnackBarModule],
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
    fixture = TestBed.createComponent(ArchiveEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

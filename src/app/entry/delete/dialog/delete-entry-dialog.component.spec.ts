import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomMaterialModule } from '../../../../shared/modules/material.module';
import { EntryService } from '../../../../shared/openapi';
// import { DeleteEntryStubService } from '../../../../test/service-stubs';
import { DeleteEntryDialogComponent } from './delete-entry-dialog.component';

describe('DeleteEntryDialogComponent', () => {
  let component: DeleteEntryDialogComponent;
  let fixture: ComponentFixture<DeleteEntryDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeleteEntryDialogComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [CustomMaterialModule, ReactiveFormsModule],
        providers: [
          // TODO { provide: DeleteEntryService, useClass: DeleteEntryStubService },
          {
            provide: MatDialogRef,
            useValue: {
              close: (dialogResult: any) => {},
            },
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

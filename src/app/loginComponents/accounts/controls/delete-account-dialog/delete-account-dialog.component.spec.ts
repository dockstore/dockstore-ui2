import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { LogoutService } from '../../../../shared/logout.service';
import { UsersService } from '../../../../shared/openapi';
import { LogoutStubService, UsersStubService } from '../../../../test/service-stubs';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [ReactiveFormsModule, DeleteAccountDialogComponent, MatLegacySnackBarModule],
        providers: [
          { provide: LogoutService, useClass: LogoutStubService },
          { provide: UsersService, useClass: UsersStubService },
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
    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

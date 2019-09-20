import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { LogoutService } from '../../../../shared/logout.service';
import { CustomMaterialModule } from '../../../../shared/modules/material.module';
import { UsersService } from '../../../../shared/swagger';
import { LogoutStubService, UsersStubService } from '../../../../test/service-stubs';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteAccountDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CustomMaterialModule, ReactiveFormsModule],
      providers: [
        { provide: LogoutService, useClass: LogoutStubService },
        { provide: UsersService, useClass: UsersStubService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {}
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

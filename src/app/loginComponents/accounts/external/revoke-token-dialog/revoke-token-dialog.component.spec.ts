import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LogoutService } from '../../../../shared/logout.service';
import { CustomMaterialModule } from '../../../../shared/modules/material.module';
import { UsersService } from '../../../../shared/swagger';
import { LogoutStubService, UsersStubService } from '../../../../test/service-stubs';
import { RevokeTokenDialogComponent } from './revoke-token-dialog.component';

describe('RevokeTokenDialogComponent', () => {
  let component: RevokeTokenDialogComponent;
  let fixture: ComponentFixture<RevokeTokenDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RevokeTokenDialogComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [CustomMaterialModule, ReactiveFormsModule],
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
    fixture = TestBed.createComponent(RevokeTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

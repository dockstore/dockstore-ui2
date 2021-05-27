import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'ng2-ui-auth';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { DateService } from '../../shared/date.service';
import { ProviderService } from '../../shared/provider.service';
import { AccountsStubService, AuthStubService } from '../../test/service-stubs';

import { SnaphotExporterModalComponent, SnapshotExporterAction } from './snaphot-exporter-modal.component';

describe('SnapshotDoiOrcidComponent', () => {
  let component: SnaphotExporterModalComponent;
  let fixture: ComponentFixture<SnaphotExporterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnaphotExporterModalComponent],
      imports: [MatSnackBarModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            workflow: {},
            version: {
              frozen: false,
              versionMetadata: {},
            },
            action: SnapshotExporterAction.SNAPSHOT,
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        { provide: AuthService, useClass: AuthStubService },
        { provide: AccountsService, useClass: AccountsStubService },
        DateService,
        ProviderService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnaphotExporterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatLegacyCommonModule } from '@angular/material/legacy-core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'ng2-ui-auth';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { DateService } from '../../shared/date.service';
import { ProviderService } from '../../shared/provider.service';
import { AccountsStubService, AuthStubService } from '../../test/service-stubs';

import { SnaphotExporterModalComponent, SnapshotExporterAction } from './snaphot-exporter-modal.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';

describe('SnapshotDoiOrcidComponent', () => {
  let component: SnaphotExporterModalComponent;
  let fixture: ComponentFixture<SnaphotExporterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnaphotExporterModalComponent],
      imports: [MatSnackBarModule, HttpClientTestingModule, RouterTestingModule, MatIconModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            workflow: { entryTypeMetadata: { term: 'workflow' } }, // simulation of a Workflow
            version: {
              frozen: false,
              versionMetadata: {
                userIdToOrcidPutCode: {},
              },
            },
            action: SnapshotExporterAction.SNAPSHOT,
            userId: 5,
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
              // Do nothing
            },
          },
        },
        { provide: AuthService, useClass: AuthStubService },
        { provide: AccountsService, useClass: AccountsStubService },
        DateService,
        ProviderService,
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
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

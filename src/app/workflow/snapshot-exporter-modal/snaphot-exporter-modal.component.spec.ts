import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { AuthService } from '../../ng2-ui-auth/public_api';
import { DateService } from '../../shared/date.service';
import { ProviderService } from '../../shared/provider.service';
import { AccountsStubService, AuthStubService, DateStubService } from '../../test/service-stubs';

import { SnaphotExporterModalComponent, SnapshotExporterAction } from './snaphot-exporter-modal.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';

describe('SnapshotDoiOrcidComponent', () => {
  let component: SnaphotExporterModalComponent;
  let fixture: ComponentFixture<SnaphotExporterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, HttpClientTestingModule, RouterTestingModule, MatIconModule, SnaphotExporterModalComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            workflow: { entryTypeMetadata: { term: 'workflow' } },
            version: {
              frozen: false,
              dois: {},
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
        { provide: DateService, useClass: DateStubService },
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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DateService } from '../../shared/date.service';
import { ProviderService } from '../../shared/provider.service';

import { SnapshotExporterModalService } from './snapshot-exporter-modal.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SnapshotExporterModalService', () => {
  let service: SnapshotExporterModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        DateService,
        ProviderService,
        DescriptorLanguageService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SnapshotExporterModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

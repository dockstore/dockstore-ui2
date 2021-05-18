import { TestBed } from '@angular/core/testing';

import { SnapshotExporterModalService } from './snapshot-exporter-modal.service';

describe('SnapshotExporterModalService', () => {
  let service: SnapshotExporterModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnapshotExporterModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

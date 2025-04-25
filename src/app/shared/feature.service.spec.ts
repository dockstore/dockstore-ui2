import { TestBed } from '@angular/core/testing';

import { FeatureService } from './feature.service';
import { Dockstore } from './dockstore.model';

describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set feature flag correctly', () => {
    service.updateFeatureFlags('?snakemake');
    expect(Dockstore.FEATURES.enableSnakemake).toBeTrue();
    service.updateFeatureFlags(null);
    expect(Dockstore.FEATURES.enableSnakemake).toBeFalse();
  });
});

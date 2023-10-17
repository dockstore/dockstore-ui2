import { TestBed } from '@angular/core/testing';
import { Dockstore } from './dockstore.model';

import { FeatureService } from './feature.service';

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
    service.updateFeatureFlags('?metrics');
    expect(Dockstore.FEATURES.enableMetrics).toBeTrue();
    service.updateFeatureFlags(null);
    expect(Dockstore.FEATURES.enableMetrics).toBeFalse();
    service.updateFeatureFlags('');
    expect(Dockstore.FEATURES.enableMetrics).toBeFalse();
  });
});

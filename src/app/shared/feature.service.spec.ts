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
    service.updateFeatureFlags('?newDashboard');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    service.updateFeatureFlags('?notebooks');
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    service.updateFeatureFlags('?metrics');
    expect(Dockstore.FEATURES.enableMetrics).toBeTrue();
    // We're ignoring the value
    service.updateFeatureFlags('?irrelevantKey&newDashboard');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    service.updateFeatureFlags('?irrelevantKey&newDashboard&notebooks');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    service.updateFeatureFlags('?newDashboard=false');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    expect(Dockstore.FEATURES.enableNotebooks).toBeFalse();
    service.updateFeatureFlags('?notebooks=false');
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    expect(Dockstore.FEATURES.enableNewDashboard).toBeFalse();
    service.updateFeatureFlags(null);
    expect(Dockstore.FEATURES.enableNewDashboard).toBeFalse();
    expect(Dockstore.FEATURES.enableNotebooks).toBeFalse();
    expect(Dockstore.FEATURES.enableMetrics).toBeFalse();
    service.updateFeatureFlags('');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeFalse();
    expect(Dockstore.FEATURES.enableNotebooks).toBeFalse();
    expect(Dockstore.FEATURES.enableMetrics).toBeFalse();
  });
});

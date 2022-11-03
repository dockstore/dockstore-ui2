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
    // We're ignoring the value
    service.updateFeatureFlags('?irrelevantKey&newDashboard');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    service.updateFeatureFlags('?newDashboard=false');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeTrue();
    service.updateFeatureFlags(null);
    expect(Dockstore.FEATURES.enableNewDashboard).toBeFalse();
    service.updateFeatureFlags('');
    expect(Dockstore.FEATURES.enableNewDashboard).toBeFalse();
  });
});

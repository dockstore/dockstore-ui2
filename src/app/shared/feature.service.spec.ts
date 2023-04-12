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
    service.updateFeatureFlags('?notebooks');
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    // We're ignoring the value
    service.updateFeatureFlags('?irrelevantKey&notebooks');
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    service.updateFeatureFlags('?notebooks=false');
    expect(Dockstore.FEATURES.enableNotebooks).toBeTrue();
    service.updateFeatureFlags(null);
    expect(Dockstore.FEATURES.enableNotebooks).toBeFalse();
    service.updateFeatureFlags('');
    expect(Dockstore.FEATURES.enableNotebooks).toBeFalse();
  });
});

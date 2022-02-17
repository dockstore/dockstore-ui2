import { TestBed } from '@angular/core/testing';

import { GravatarService } from './gravatar.service';

describe('GravatarService', () => {
  let service: GravatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create gravatar urls', () => {
    expect(service.gravatarUrlForImageUrl(null)).toBeNull();
    expect(service.gravatarUrlForImageUrl(undefined)).toBeNull();
    expect(service.gravatarUrlForImageUrl('https://foo.com').endsWith('https://foo.com')).toBeTrue();
    expect(service.gravatarUrlForImageUrl('https://foo.com').startsWith(service.gravatarBaseUrl)).toBeTrue();
  });
});

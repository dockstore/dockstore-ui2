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
    const gravatarUrlForImageUrl = service.gravatarUrlForImageUrl('https://foo.com');
    expect(gravatarUrlForImageUrl.endsWith(encodeURIComponent('https://foo.com'))).toBeTrue();
    expect(gravatarUrlForImageUrl.startsWith(service.gravatarBaseUrl)).toBeTrue();
    const emailAvatar = service.gravatarUrlForEmail('foo@goo.com', 'https://foo.com');
    // email hashified
    expect(emailAvatar.indexOf('foo@goo.com')).toBe(-1);

    // Check no dangling curly braces
    const bracesRegex = /[{}]/;
    expect(bracesRegex.test(emailAvatar)).toBeFalse();
    expect(bracesRegex.test(gravatarUrlForImageUrl)).toBeFalse();
    expect(bracesRegex.test(service.gravatarUrlForMysteryPerson())).toBeFalse();
  });
});

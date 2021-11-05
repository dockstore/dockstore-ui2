import { TestBed } from '@angular/core/testing';

import { FooterService } from './footer.service';

describe('FooterService', () => {
  let service: FooterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterService);
  });

  it('should generate markdown', () => {
    // sanity test the method; don't want to look for the exact value as that would just be writing it all over again
    const markdown = service.versionsToMarkdown('981edd1', '2.6.1-39-g597aeeed', '1.9.0', '3723b1a"', null, null, null, null, null);
    expect(markdown).toContain('981edd1');
  });

  it('should handle nulls', () => {
    const markdown = service.versionsToMarkdown(null, null, null, null, null, null, null, null, null);
    expect(markdown.length).toBeGreaterThan(100);
  });
});

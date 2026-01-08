import { ClipboardModule } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';

import { FooterService } from './footer.service';

describe('FooterService', () => {
  let service: FooterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClipboardModule],
    });
    service = TestBed.inject(FooterService);
  });

  it('should generate markdown', () => {
    // sanity test the method; don't want to look for the exact value as that would just be writing it all over again
    const markdown = service.versionsToMarkdown(
      'domainurl.com',
      '981edd1',
      '2.6.1-39-g597aeeed',
      '3723b1a"',
      null,
      null,
      null,
      null,
      'potato',
      'potato'
    );
    expect(markdown).toContain('domainurl.com');
    expect(markdown).toContain('981edd1');
    expect(markdown).toContain('potato');
    expect(markdown).toContain('checkUrlLambdaVersion');
    expect(markdown).toContain('supportVersion');
  });

  it('should handle nulls', () => {
    const markdown = service.versionsToMarkdown(null, null, null, null, null, null, null, null, null, null);
    expect(markdown.length).toBeGreaterThan(100);
    expect(markdown).not.toContain('compose_setup');
    expect(markdown).not.toContain('dockstore-deploy');
    expect(markdown).not.toContain('cwlParsingLambdaVersion');
    expect(markdown).not.toContain('wdlParsingLambdaVersion');
    expect(markdown).not.toContain('nextflowParsingLambdaVersion');
    expect(markdown).not.toContain('galaxyParsingPluginVersion');
    expect(markdown).not.toContain('checkUrlLambdaVersion');
    expect(markdown).not.toContain('supportVersion');
  });
});

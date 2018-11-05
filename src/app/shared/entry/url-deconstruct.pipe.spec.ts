/*
 * Unit test for urlDeconstruct pipe
 */

import { UrlDeconstructPipe } from './url-deconstruct.pipe';

describe('Pipe: urlDeconstruct', () => {
  it('Create an instance and return url pathname', function () {
    const pipe = new UrlDeconstructPipe();

    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', ''))
      .toBe('agduncan94/hello-dockstore-workflow');
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', 'master'))
      .toBe('agduncan94/hello-dockstore-workflow/tree/master');
    expect(pipe.transform('https://bitbucket.org/rjbautis/hello-dockstore', 'develop'))
      .toBe('rjbautis/hello-dockstore/src/develop');
  });
});

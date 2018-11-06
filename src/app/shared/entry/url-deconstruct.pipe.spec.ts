/**
 * Unit test for urlDeconstruct pipe
 */

import { UrlDeconstructPipe } from './url-deconstruct.pipe';

describe('Pipe: urlDeconstruct', () => {
  it('Create an instance and return url pathname', function () {
    const pipe = new UrlDeconstructPipe();

    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', ''))
      .toBe('agduncan94/hello-dockstore-workflow');
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', null))
      .toBe('agduncan94/hello-dockstore-workflow');
    expect(pipe.transform('https://bitbucket.org/agduncan94/hello-dockstore-workflow', undefined))
      .toBe('agduncan94/hello-dockstore-workflow');

    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', 'master'))
      .toBe('agduncan94/hello-dockstore-workflow/tree/master');
    expect(pipe.transform('https://bitbucket.org/rjbautis/hello-dockstore', 'develop'))
      .toBe('rjbautis/hello-dockstore/src/develop');

    expect(pipe.transform('https://hub.docker.com/r/dockstore/hello-dockstore-image', ''))
      .toBe('dockstore/hello-dockstore-image');
    expect(pipe.transform('https://quay.io/repository/dockstore/hello-dockstore-example', ''))
      .toBe('dockstore/hello-dockstore-example');

    expect(pipe.transform('https://website.com/pathname/hello-world', 'example'))
      .toBe('pathname/hello-world');
    expect(pipe.transform('http://website.com/pathname/hello-world', 'example'))
      .toBe('pathname/hello-world');
  });
});

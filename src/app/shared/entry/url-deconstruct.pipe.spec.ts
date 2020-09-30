/**
 * Unit test for urlDeconstruct pipe
 */

import { UrlDeconstructPipe } from './url-deconstruct.pipe';

describe('Pipe: urlDeconstruct', () => {
  it('Create an instance and return url pathname', function () {
    const pipe = new UrlDeconstructPipe();

    // Truthy tests
    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', '')).toBe(
      'github.com/agduncan94/hello-dockstore-workflow'
    );
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', null)).toBe(
      'github.com/agduncan94/hello-dockstore-workflow'
    );
    expect(pipe.transform('https://bitbucket.org/agduncan94/hello-dockstore-workflow', undefined)).toBe(
      'bitbucket.org/agduncan94/hello-dockstore-workflow'
    );
    expect(pipe.transform('https://website.com/pathname/hello-world', null)).toBe('website.com/pathname/hello-world');

    // External service link tests
    expect(pipe.transform('https://github.com/agduncan94/hello-dockstore-workflow', 'master')).toBe(
      'github.com/agduncan94/hello-dockstore-workflow:master'
    );
    expect(pipe.transform('https://bitbucket.org/rjbautis/hello-dockstore', 'develop')).toBe(
      'bitbucket.org/rjbautis/hello-dockstore:develop'
    );
    expect(pipe.transform('https://gitlab.com/rjbautis/hello-world', 'develop')).toBe('gitlab.com/rjbautis/hello-world:develop');

    // Edge cases: tests for multiple occurrences of an external service inside one string
    expect(pipe.transform('https://github.com/denis-yuen/test.github.com', 'develop')).toBe(
      'github.com/denis-yuen/test.github.com:develop'
    );
    expect(pipe.transform('https://bitbucket.org/denis-yuen/test.github.com', 'master')).toBe(
      'bitbucket.org/denis-yuen/test.github.com:master'
    );
    expect(pipe.transform('https://gitlab.com/rjbautis/test.bitbucket.org', null)).toBe('gitlab.com/rjbautis/test.bitbucket.org');

    expect(pipe.transform('https://hub.docker.com/r/dockstore/hello-dockstore-image', null)).toBe(
      'hub.docker.com/dockstore/hello-dockstore-image'
    );
    expect(pipe.transform('https://quay.io/repository/dockstore/hello-dockstore-example', null)).toBe(
      'quay.io/dockstore/hello-dockstore-example'
    );

    // HTTP and HTTPS tests
    expect(pipe.transform('https://website.com/pathname/hello-world', 'example')).toBe('website.com/pathname/hello-world:example');
    expect(pipe.transform('http://website.com/pathname/hello-world', 'example')).toBe('website.com/pathname/hello-world:example');
    expect(pipe.transform('source', 'version')).toBe('source');
  });
});

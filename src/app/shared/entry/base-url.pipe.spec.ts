import { BaseUrlPipe } from './base-url.pipe';

describe('Pipe: BaseUrl', () => {
  it('create an instance and return base url', () => {
    const pipe = new BaseUrlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/foobar/hello_world', 'master')).toBe('https://github.com/foobar/hello_world/blob/master/');
    expect(pipe.transform('https://gitlab.com/foobar/hello_world', 'develop', 'dir/readme.md')).toBe(
      'https://gitlab.com/foobar/hello_world/blob/develop/dir/'
    );
    expect(pipe.transform('https://bitbucket.org/foobar/hello_world', '1.0')).toBe('https://bitbucket.org/foobar/hello_world/src/1.0/');
  });
});

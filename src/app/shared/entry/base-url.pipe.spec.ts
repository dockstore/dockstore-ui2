import { BaseUrlPipe } from './base-url.pipe';

describe('Pipe: BaseUrl', () => {
  it('create an instance and return base url', () => {
    const pipe = new BaseUrlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/foobar/hello_world', 'master')).toBe('https://github.com/dockstore/foobar/blob/master/');
    expect(pipe.transform('https://gitlab.com/foobar/hello_world', 'develop')).toBe('https://gitlab.com/foobar/hello_world/blob/develop/');
    expect(pipe.transform('https://bitbucket.org/foobar/hello_world', '1.0')).toBe('https://bitbucket.org/dockstore/foobar/src/1.0/');
  });
});

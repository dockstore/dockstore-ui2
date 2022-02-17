import { GravatarPipe } from './gravatar.pipe';
import { GravatarService } from './gravatar.service';

describe('GravatarPipe', () => {
  const fakeUrl = 'https://foo.com/goo.jpg';
  it('create an instance', () => {
    const pipe = new GravatarPipe(new GravatarService());
    expect(pipe).toBeTruthy();
  });
  it('creates the correct urls', () => {
    const pipe = new GravatarPipe(new GravatarService());
    expect(pipe.transform(fakeUrl).endsWith(encodeURIComponent(fakeUrl))).toBeTrue();
    expect(pipe.transform(fakeUrl).startsWith('https://www.gravatar')).toBeTrue();
    expect(pipe.transform(undefined)).toBe(null);
    expect(pipe.transform(null)).toBeNull();
  });
});

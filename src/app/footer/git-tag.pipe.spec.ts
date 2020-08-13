import { GitTagPipe } from './git-tag.pipe';

describe('GitTagPipe', () => {
  it('create an instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe).toBeTruthy();
  });
  it('handles dev UI instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe.transform('2.6.1-26-geb3771b6')).toEqual('/commits/eb3771b6');
  });
  it('handles a release instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe.transform('2.6.1')).toEqual('/releases/tags/2.6.1');
  });
});

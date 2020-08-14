import { GitTagPipe } from './git-tag.pipe';

describe('GitTagPipe', () => {
  it('create an instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe).toBeTruthy();
  });
  it('handles dev UI instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe.transform('2.6.1-26-geb3771b6')).toEqual('eb3771b6');
    expect(pipe.transform('2.6.1-26-geb3771b6', true)).toEqual('commits/eb3771b6');
  });
  it('handles a release instance', () => {
    const pipe = new GitTagPipe();
    expect(pipe.transform('2.6.1')).toEqual('2.6.1');
    expect(pipe.transform('2.6.1', true)).toEqual('releases/tag/2.6.1');
  });
  it('handles a plain old commit id', () => {
    const pipe = new GitTagPipe();
    expect(pipe.transform('e422a55')).toEqual('e422a55');
    expect(pipe.transform('e422a55', true)).toEqual('commits/e422a55');
  });
});

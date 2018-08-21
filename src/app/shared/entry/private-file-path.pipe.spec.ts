import { PrivateFilePathPipe } from './private-file-path.pipe';

describe('PrivateFilePathPipe', () => {
  it('create an instance', () => {
    const pipe = new PrivateFilePathPipe(null);
    expect(pipe).toBeTruthy();
  });
});

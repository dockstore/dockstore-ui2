import { PrivateFileDownloadPipe } from './private-file-download.pipe';

describe('PrivateFileDownloadPipe', () => {
  it('create an instance', () => {
    const pipe = new PrivateFileDownloadPipe(null);
    expect(pipe).toBeTruthy();
  });
});

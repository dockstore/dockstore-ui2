import { PublicFileDownloadPipe } from './public-file-download.pipe';

describe('PublicFileDownloadPipe', () => {
  it('create an instance', () => {
    const pipe = new PublicFileDownloadPipe(null);
    expect(pipe).toBeTruthy();
  });
});

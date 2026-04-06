import { ZenodoAccessLinkPipe } from './zenodo-access-link.pipe';

describe('Pipe: zenodoAccessLink', () => {
  it('create an instance', () => {
    const pipe = new ZenodoAccessLinkPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('10.5072/zenodo.68521', 'foobarlinktoken')).toBe('https://zenodo.org/records/68521?token=foobarlinktoken');
  });
});

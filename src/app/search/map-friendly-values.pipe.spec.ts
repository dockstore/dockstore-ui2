import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';

describe('Pipe: MapFriendlyValuese', () => {
  it('create an instance and test friendly verified conversion', () => {
    const pipe = new MapFriendlyValuesPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('file_formats.keyword', 'potato')).toBe('potato');
    expect(pipe.transform('source_control_provider.keyword', 'BITBUCKET')).toBe('bitbucket.org');
  });
});

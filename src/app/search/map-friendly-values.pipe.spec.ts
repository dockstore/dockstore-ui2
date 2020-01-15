import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';

describe('Pipe: MapFriendlyValuese', () => {
  it('create an instance and test friendly verified conversion', () => {
    const pipe = new MapFriendlyValuesPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('file_formats.keyword', 'potato')).toBe('potato');
    expect(pipe.transform('potato', null)).toBe(null);
    expect(pipe.transform('potato', 0)).toBe('0');
    expect(pipe.transform('has_checker', 0)).toBe('unchecked workflow');
    expect(pipe.transform('source_control_provider.keyword', 'BITBUCKET')).toBe('Bitbucket');
    expect(pipe.transform('descriptor_type', 'NFL')).toBe('Nextflow');
    expect(pipe.transform('descriptor_type', 'nfl')).toBe('Nextflow');
  });
});

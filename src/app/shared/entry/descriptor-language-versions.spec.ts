import { DescriptorLanguageVersionsPipe } from './descriptor-language-versions.pipe';

describe('Pipe: DescriptorLanguageVersionsPipe', () => {
  it('create an instance and return base url', () => {
    const pipe = new DescriptorLanguageVersionsPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('WDL', ['1.0, 1.1'])).toBe('WDL 1.0, 1.1');
    expect(pipe.transform('CWL', ['v1.0'])).toBe('CWL v1.0');
    expect(pipe.transform('WDL', [])).toBe('');
    expect(pipe.transform('Nextflow', ['Nextflow >=0.32.0', 'Nextflow !>=23.04.0'], false)).toBe('!>=23.04.0, >=0.32.0');
    expect(pipe.transform('Nextflow', ['Nextflow >=0.32.0'], false)).toBe('>=0.32.0');
  });
});

import { VersionProviderUrlPipe } from './versionProviderUrl.pipe';

describe('Pipe: VersionProviderUrle', () => {
  it('create an instance', () => {
    const pipe = new VersionProviderUrlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('https://github.com/garyluu/example_cwl_workflow', '')).toBe('https://github.com/garyluu/example_cwl_workflow');
    expect(pipe.transform('https://github.com/garyluu/example_cwl_workflow', 'potato')).toBe(
      'https://github.com/garyluu/example_cwl_workflow/tree/potato'
    );
    expect(pipe.transform('beef', 'stew')).toBe('beef');
  });
});

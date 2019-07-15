import { RemoveExtensionPipe } from './remove-extension.pipe';

describe('Pipe: RemoveExtensione', () => {
  it('create an instance', () => {
    const pipe = new RemoveExtensionPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('1556226034.log')).toBe('1556226034');
  });
});

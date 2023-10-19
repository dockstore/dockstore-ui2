import { JoinWithEllipsesPipe } from './join-with-ellipses.pipe';

describe('Pipe: JoinWithEllipsesPipe', () => {
  it('create an instance and join with ellipses', () => {
    const pipe = new JoinWithEllipsesPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(['foo', 'bar'])).toBe('foo...bar');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar')).toBe('');
  });
});

import { GetHistogramWidthPipe } from './get-histogram-width.pipe';

describe('Pipe: GetHistogramWidth', () => {
  const bucket = new Map([['foo', 1], ['foo2', 1]]);
  it('should return histogram width as percentage of items in facet', () => {
    const pipe = new GetHistogramWidthPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(bucket, 'foo')).toBe(50);
  });
});

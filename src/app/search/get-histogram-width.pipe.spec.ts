import { GetHistogramWidthPipe } from './get-histogram-width.pipe';

describe('Pipe: GetHistogramWidth', () => {
  const bucket1 = new Map([
    ['foo1', 1],
    ['foo2', 2],
  ]);
  const bucket2 = new Map([
    ['foo3', 3],
    ['foo4', 4],
  ]);
  const buckets = { Items: bucket1, SelectedItems: bucket2 };
  it('should return histogram width as percentage of items in facet', () => {
    const pipe = new GetHistogramWidthPipe();
    expect(pipe).toBeTruthy();
    const scalingFactor = 0.75;
    expect(pipe.transform(buckets, 'foo1')).toBe(10 * scalingFactor);
    expect(pipe.transform(buckets, 'foo2')).toBe(20 * scalingFactor);
    expect(pipe.transform(buckets, 'foo3')).toBe(30 * scalingFactor);
    expect(pipe.transform(buckets, 'foo4')).toBe(40 * scalingFactor);
  });
});

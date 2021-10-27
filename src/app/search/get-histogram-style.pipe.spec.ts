import { GetHistogramStylePipe } from './get-histogram-style.pipe';

describe('Pipe: GetHistogramStyle', () => {
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
    const pipe = new GetHistogramStylePipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(buckets, 'foo1', 0)).toEqual({ background: 'linear-gradient(to left, #d2fbf0 7.5%, transparent 7.5%)' });
    expect(pipe.transform(buckets, 'foo2', 1)).toEqual({ background: 'linear-gradient(to left, #d0effd 15%, transparent 15%)' });
    expect(pipe.transform(buckets, 'foo3', 0)).toEqual({ background: 'linear-gradient(to left, #d2fbf0 22.5%, transparent 22.5%)' });
    expect(pipe.transform(buckets, 'foo4', 1)).toEqual({ background: 'linear-gradient(to left, #d0effd 30%, transparent 30%)' });
  });
});

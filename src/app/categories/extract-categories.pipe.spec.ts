import { ExtractCategoriesPipe } from './extract-categories.pipe';
import { CategorySummary } from 'app/shared/openapi';

function cat(name: string, displayName: string): CategorySummary {
  return { name, displayName } as CategorySummary;
}

describe('ExtractCategoriesPipe', () => {
  let pipe: ExtractCategoriesPipe;

  beforeEach(() => {
    pipe = new ExtractCategoriesPipe();
  });

  it('returns empty array for empty input', () => {
    expect(pipe.transform([], 'Operations')).toEqual([]);
  });

  it('returns empty array when no categories match the group', () => {
    const categories = [cat('operation-alignment', 'Alignment')];
    expect(pipe.transform(categories, 'Topics')).toEqual([]);
  });

  it('extracts categories matching the requested group', () => {
    const categories = [cat('my-category', 'My Category'), cat('operation-alignment', 'Alignment'), cat('topic-genomics', 'Genomics')];
    const result = pipe.transform(categories, 'Operations');
    expect(result.map((c) => c.name)).toEqual(['operation-alignment']);
  });

  it('sorts non-IO groups alphabetically by displayName', () => {
    const categories = [cat('operation-variant-calling', 'Variant Calling'), cat('operation-alignment', 'Alignment')];
    const result = pipe.transform(categories, 'Operations');
    expect(result.map((c) => c.displayName)).toEqual(['Alignment', 'Variant Calling']);
  });

  it('sorts IO groups with formats before data, each sorted alphabetically', () => {
    const categories = [
      cat('input-data-reads', 'Reads'),
      cat('input-format-cram', 'CRAM'),
      cat('input-data-alignments', 'Alignments'),
      cat('input-format-bam', 'BAM'),
    ];
    const result = pipe.transform(categories, 'Inputs');
    expect(result.map((c) => c.displayName)).toEqual(['BAM', 'CRAM', 'Alignments', 'Reads']);
  });

  it('sorts output formats before output data', () => {
    const categories = [cat('output-data-variants', 'Variants'), cat('output-format-vcf', 'VCF')];
    const result = pipe.transform(categories, 'Outputs');
    expect(result.map((c) => c.displayName)).toEqual(['VCF', 'Variants']);
  });

  it('assigns ungrouped names to Categories', () => {
    const categories = [cat('my-category', 'My Category'), cat('operation-foo', 'Foo')];
    const result = pipe.transform(categories, 'Categories');
    expect(result.map((c) => c.name)).toEqual(['my-category']);
  });
});

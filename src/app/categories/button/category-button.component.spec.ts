import { CategoryButtonComponent } from './category-button.component';
import { Category, CategorySummary } from 'app/shared/openapi';

describe('CategoryButtonComponent tooltip', () => {
  let component: CategoryButtonComponent;

  beforeEach(() => {
    component = new CategoryButtonComponent();
    component.entryType = 'workflow';
  });

  function tooltip(overrides: Partial<Category & CategorySummary> = {}): string {
    component.category = {
      name: 'operation-sort',
      displayName: 'Sort',
      topic: 'Sorting of sequences',
      ...overrides,
    } as unknown as Category & CategorySummary;
    component.ngOnChanges();
    return component.tooltip;
  }

  describe('source attribution', () => {
    it('reports EDAM URL when metadata.source is an edamontology.org URL', () => {
      expect(tooltip({ metadata: { source: 'http://edamontology.org/operation_3802' } })).toContain(
        'Derived from EDAM: http://edamontology.org/operation_3802'
      );
    });

    it('reports AI attribution when metadata.source is "ai"', () => {
      expect(tooltip({ metadata: { source: 'ai' } })).toContain('Category created by AI.');
    });

    it('reports Dockstore curator attribution when metadata is absent', () => {
      expect(tooltip({})).toContain('Category created by Dockstore.');
    });

    it('reports Dockstore curator attribution when source is an unrecognized value', () => {
      expect(tooltip({ metadata: { source: 'unknown' } })).toContain('Category created by Dockstore.');
    });
  });

  describe('category type label', () => {
    it('uses "Category:" for non-aiManaged categories', () => {
      expect(tooltip({ aiManaged: false })).toContain('Category:');
    });

    it('uses "Operation:" for aiManaged operation- categories', () => {
      expect(tooltip({ name: 'operation-sort', aiManaged: true })).toContain('Operation:');
    });

    it('uses "Topic:" for aiManaged topic- categories', () => {
      expect(tooltip({ name: 'topic-genomics', aiManaged: true })).toContain('Topic:');
    });

    it('uses "Input Format:" for aiManaged input-format- categories', () => {
      expect(tooltip({ name: 'input-format-bam', aiManaged: true })).toContain('Input Format:');
    });

    it('uses "Input Data:" for aiManaged input-data- categories', () => {
      expect(tooltip({ name: 'input-data-reads', aiManaged: true })).toContain('Input Data:');
    });

    it('uses "Output Format:" for aiManaged output-format- categories', () => {
      expect(tooltip({ name: 'output-format-vcf', aiManaged: true })).toContain('Output Format:');
    });

    it('uses "Output Data:" for aiManaged output-data- categories', () => {
      expect(tooltip({ name: 'output-data-variants', aiManaged: true })).toContain('Output Data:');
    });
  });

  describe('topic', () => {
    it('includes topic text when set', () => {
      expect(tooltip({ topic: 'Sorting of sequences' })).toContain('Sorting of sequences');
    });

    it('omits topic text when not set', () => {
      expect(tooltip({ topic: undefined })).not.toContain('Sorting of sequences');
    });
  });

  describe('curator membership', () => {
    it('shows USER membership message', () => {
      expect(tooltip({ curator: CategorySummary.CuratorEnum.USER })).toContain('Category membership approved by entry owner.');
    });

    it('shows DOCKSTORE membership message', () => {
      expect(tooltip({ curator: CategorySummary.CuratorEnum.DOCKSTORE })).toContain('Category membership curated by Dockstore.');
    });

    it('shows AI membership message', () => {
      expect(tooltip({ curator: CategorySummary.CuratorEnum.AI })).toContain('Category membership curated by AI.');
    });

    it('omits membership line when no curator is set', () => {
      expect(tooltip({ curator: undefined })).not.toContain('Category membership');
    });
  });
});

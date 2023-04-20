import { SearchAuthorsHtmlPipe } from './search-authors-html.pipe';

describe('Pipe: SearchAuthorsHtmlPipe', () => {
  it('create an instance and return search authors HTML', () => {
    const pipe = new SearchAuthorsHtmlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform([{ name: 'Author 1' }, { name: 'ORCID author', orcid: '1234-1234-1234-1234' }])).toBe(
      'Author 1, <a href="https://orcid.org/1234-1234-1234-1234" target="_blank" rel="noopener noreferrer">ORCID author</a>'
    );
    expect(pipe.transform([{ name: 'Author 1' }, { name: 'Author 2' }])).toBe('Author 1, Author 2');
    expect(pipe.transform([{ name: 'Author 1' }, { name: 'ORCID author', orcid: '1234-1234-1234-1234' }], false)).toBe(
      'Author 1, ORCID author'
    );

    // The list of authors may contain a dummy Author where the name is null for the purposes of ES indexing
    expect(pipe.transform([{ name: null }], false)).toBe('n/a');
  });
});

import { SearchAuthorsHtmlPipe } from './search-authors-html.pipe';
import { SearchService } from 'app/search/state/search.service';

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
    expect(pipe.transform([{ name: null }], false)).toBe(SearchService.NOT_AVAILABLE);
  });
  it('should escape HTML in author information when formatting as HTML', () => {
    const pipe = new SearchAuthorsHtmlPipe();
    expect(pipe.transform([{ name: '<img src=x>' }, { name: 'A & B', orcid: '"><img src=x>' }])).toBe(
      '&lt;img src&#x3D;x&gt;, <a href="https://orcid.org/&quot;&gt;&lt;img src&#x3D;x&gt;" target="_blank" rel="noopener noreferrer">A &amp; B</a>'
    );
    // Not formatted as HTML, so not escaped
    expect(pipe.transform([{ name: '<img src=x>' }], false)).toBe('<img src=x>');
  });
});

import { Pipe, PipeTransform } from '@angular/core';
import { Author, OrcidAuthorInformation } from 'app/shared/openapi';

@Pipe({
  name: 'getSearchAuthorsHtml',
})
/**
 * This pipe filters results in the facet according to the facet search text
 *
 * @param {Array<Author | OrcidAuthorInformation>} authors The array of authors
 * @param {boolean} formatAsInnerHtml Whether or not to format the string with HTML to be used as innerHTML
 * @returns {string} A string for the inner HTML
 * @memberof SearchAuthorsHtmlPipe
 */
export class SearchAuthorsHtmlPipe implements PipeTransform {
  transform(authors: Array<Author | OrcidAuthorInformation>, formatAsInnerHtml: boolean = true): string {
    // The list of authors may contain a dummy Author where the name is null for the purposes of ES indexing
    // Filter for authors with names
    const nonNullAuthors = authors.filter((author) => author.name);
    if (nonNullAuthors.length === 0) {
      return 'n/a';
    }

    const authorNames: Array<string> = [];
    nonNullAuthors.forEach((author) => {
      let orcidAuthor = author as OrcidAuthorInformation;
      if (orcidAuthor.orcid && formatAsInnerHtml) {
        authorNames.push(
          `<a href="https://orcid.org/${orcidAuthor.orcid}" target="_blank" rel="noopener noreferrer">${orcidAuthor.name}</a>`
        );
      } else {
        authorNames.push(author.name);
      }
    });

    return authorNames.join(', ');
  }
}

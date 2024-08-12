import { Injectable } from '@angular/core';

/**
 * This service encapsulates the algorithms that we use to convert a search string to its logical representation (currently, an array of terms).
 * @export
 * @class TermParserService
 */
@Injectable()
export class TermParserService {
  constructor() {}

  /**
   * Converts the specified search text to its constituent array of search terms.
   * Double-quoted substrings map to a single search term.
   */
  public parse(searchText: string): string[] {
    // Split the terms, conserving double-quoted strings.
    const terms = searchText.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
    // Strip the double quotes from each term.
    return terms.map((term) => term.replace(/"/g, ''));
  }
}

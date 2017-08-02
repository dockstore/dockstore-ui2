export class CategorySort {
  SortBy: boolean; // true: Sort by count; false: Sort by alphabetical
  CountOrderBy: boolean; // true: asc order; false: desc order
  AlphabetOrderBy: boolean; // true: asc order; false: desc order
  constructor(sortBy, countOrderBy, alphabetOrderBy) {
    this.SortBy = sortBy;
    this.CountOrderBy = countOrderBy;
    this.AlphabetOrderBy = alphabetOrderBy;
  }
}

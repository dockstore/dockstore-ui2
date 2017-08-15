import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SearchService {
  private searchInfoSource = new BehaviorSubject<any>(null);
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  searchInfo$ = this.searchInfoSource.asObservable();
  loading$ = this.loading.asObservable();
  /**
   * These are the terms which use "must" filters
   * Example: Results returned can be private or public but never both
   * @private
   * @memberof SearchService
   */
  public exclusiveFilters = ['tags.verified', 'private_access'];
  setSearchInfo(searchInfo) {
    this.searchInfoSource.next(searchInfo);
  }
  setLoading(loading: boolean) {
    this.loading.next(loading);
  }
  constructor() {
  }
  /**
   * By default, bodybuilder will create a aggregation name called agg_<aggregationType>_<fieldToAggregate>
   * This converts it to just <fieldToAggregate>
   * @param {string} aggregationName the default aggregation name
   * @returns {string} the fieldToAggregate
   * @memberof SearchService
   */
  aggregationNameToTerm(aggregationName: string): string {
    return aggregationName.replace('agg_terms_', '');
  }
}

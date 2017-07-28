import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SearchService {
  private filterSource = new BehaviorSubject<any>(null);
  filter$ = this.filterSource.asObservable();
  private checkboxSource = new BehaviorSubject<any>(null);
  checkbox$ = this.checkboxSource.asObservable();
  private valuesSource = new BehaviorSubject<any>(null);
  values$ = this.valuesSource.asObservable();
  /**
   * These are the terms which use "must" filters
   * Example: Results returned can be private or public but never both
   * @private
   * @memberof SearchService
   */
  public exclusiveFilters = ['tags.verified', 'private_access'];

  setFilter(filter: any) {
    this.filterSource.next(filter);
  }
  setCheckbox(checkbox: any) {
    this.checkboxSource.next(checkbox);
  }
  setValues(value: any) {
    this.valuesSource.next(value);
  }
  constructor() {
    console.log('CONSTRUCTOR~');
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

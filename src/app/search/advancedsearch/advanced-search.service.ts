import {AdvancedSearchObject} from './../../shared/models/AdvancedSearchObject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';

@Injectable()
export class AdvancedSearchService {
  private readonly initAdvancedSearch = {
    ANDSplitFilter: '',
    ANDNoSplitFilter: '',
    ORFilter: '',
    NOTFilter: '',
    searchMode: 'files',
    toAdvanceSearch: false
  };
  advancedSearch$: BehaviorSubject<AdvancedSearchObject> = new BehaviorSubject<AdvancedSearchObject>(this.initAdvancedSearch);
  showModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
  }

  setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
    this.advancedSearch$.next(advancedSearch);
  }

  setShowModal(showModal: boolean): void {
    this.showModal$.next(showModal);
  }

  clear(): void {
    this.advancedSearch$.next(this.initAdvancedSearch);
  }
}

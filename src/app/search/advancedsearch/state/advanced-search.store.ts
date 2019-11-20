import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';

export interface AdvancedSearchState {
  advancedSearch: AdvancedSearchObject;
  showModal: boolean;
}
// toAdvanceSearch is used because this is not done correctly
// Right now, it's used to determine whether or not to re-query elasticsearch
// Ideally, user actions and initalization should trigger the re-query instead

export function createInitialState(): AdvancedSearchState {
  return {
    advancedSearch: {
      ANDSplitFilter: '',
      ANDNoSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'files',
      toAdvanceSearch: false
    },
    showModal: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'advanced-search', resettable: true })
export class AdvancedSearchStore extends Store<AdvancedSearchState> {
  constructor() {
    super(createInitialState());
  }
}

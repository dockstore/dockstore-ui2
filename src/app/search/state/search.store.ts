/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';

export interface SearchState {
  shortUrl: string;
  workflowhit: any;
  toolhit: any;
  showToolTagCloud: boolean;
  showWorkflowTagCloud: boolean;
  searchText: string;
  filterKeys: Array<string>;
  autocompleteTerms: Array<string>;
  suggestTerm: string;
  pageSize: number;
  advancedSearch: AdvancedSearchObject;
  showModal: boolean;
}

export const initialAdvancedSearchObject: AdvancedSearchObject = {
  ANDSplitFilter: '',
  ANDNoSplitFilter: '',
  ORFilter: '',
  NOTFilter: '',
  searchMode: 'files'
};

export function createInitialState(): SearchState {
  return {
    shortUrl: null,
    workflowhit: null,
    toolhit: null,
    showToolTagCloud: false,
    showWorkflowTagCloud: false,
    searchText: '',
    filterKeys: [],
    autocompleteTerms: [],
    suggestTerm: '',
    pageSize: 10,
    advancedSearch: initialAdvancedSearchObject,
    showModal: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'search' })
export class SearchStore extends Store<SearchState> {
  constructor() {
    super(createInitialState());
  }
}

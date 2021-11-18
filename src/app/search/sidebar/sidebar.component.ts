import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
} from '@fortawesome/free-solid-svg-icons';
import { AdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';
import { CategorySort } from 'app/shared/models/CategorySort';
import { SubBucket } from 'app/shared/models/SubBucket';
import { Observable } from 'rxjs';
import { AdvancedSearchQuery } from '../advancedsearch/state/advanced-search.query';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input()
  public orderedBuckets: Map<string, SubBucket> = new Map<string, SubBucket>();
  public selectedIndex$: Observable<number>;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  public friendlyNames: Map<string, string> = this.searchService.friendlyNames;
  public toolTips: Map<string, string> = this.searchService.tooltips;
  public facetSearchText = '';
  public facetAutocompleteTerms$: Observable<Array<string>>;
  @Input()
  public sortModeMap: Map<string, CategorySort> = new Map<string, CategorySort>();
  public faSortAlphaDown = faSortAlphaDown;
  public faSortAlphaUp = faSortAlphaUp;
  public faSortNumericDown = faSortNumericDown;
  public faSortNumericUp = faSortNumericUp;
  public faAngleDoubleDown = faAngleDoubleDown;
  public faAngleDoubleUp = faAngleDoubleUp;
  // Shows which of the buckets are current selected
  @Input()
  public checkboxMap: Map<string, Map<string, boolean>> = new Map<string, Map<string, boolean>>();
  @Input()
  // Shows which of the categories (registry, author, etc) are expanded to show all available buckets
  public fullyExpandMap: Map<string, boolean> = new Map<string, boolean>();
  // Filters isn't actually shown in the view
  @Input()
  public filters: Map<string, Set<string>> = new Map<string, Set<string>>();
  @Output()
  uploaded = new EventEmitter<string>();
  constructor(private searchQuery: SearchQuery, public searchService: SearchService, private advancedSearchQuery: AdvancedSearchQuery) {}

  ngOnInit(): void {
    this.selectedIndex$ = this.searchQuery.savedTabIndex$;
    this.facetAutocompleteTerms$ = this.searchQuery.facetAutoCompleteTerms$;
  }

  getKeys(bucketMap: Map<any, any>): Array<string> {
    return Array.from(bucketMap.keys());
  }

  // Get autocomplete terms
  onFacetSearchKey(key) {
    const values = this.facetSearchText.toLowerCase();
    const unfilteredItems = Array.from(this.orderedBuckets.get(key).Items.entries());
    const filteredItems = unfilteredItems.filter((item) => item[0].toLowerCase().includes(values)).map((item) => item[0]);
    this.searchService.setFacetAutocompleteTerms(filteredItems);
  }

  clickSortMode(category: string, sortMode: boolean) {
    let orderedMap2;
    if (this.sortModeMap.get(category).SortBy === sortMode) {
      let orderBy: boolean;
      if (this.sortModeMap.get(category).SortBy) {
        // Sort by Count
        orderBy = this.sortModeMap.get(category).CountOrderBy;
        this.sortModeMap.get(category).CountOrderBy = !orderBy;
      } else {
        orderBy = this.sortModeMap.get(category).AlphabetOrderBy;
        this.sortModeMap.get(category).AlphabetOrderBy = !orderBy;
      }
    }
    if (sortMode) {
      /* Reorder the bucket map by count */
      orderedMap2 = this.searchService.sortCategoryValue(
        this.orderedBuckets.get(category).Items,
        sortMode,
        this.sortModeMap.get(category).CountOrderBy
      );
    } else {
      /* Reorder the bucket map by alphabet */
      orderedMap2 = this.searchService.sortCategoryValue(
        this.orderedBuckets.get(category).Items,
        sortMode,
        this.sortModeMap.get(category).AlphabetOrderBy
      );
    }
    this.orderedBuckets.get(category).Items = orderedMap2;
    this.sortModeMap.get(category).SortBy = sortMode;
  }

  getBucketKeys(key: string) {
    return Array.from(this.orderedBuckets.get(key).SelectedItems.keys());
  }

  /**
   * This handles clicking a facet and doing the search
   * @param category
   * @param categoryValue
   */
  onClick(category: string, categoryValue: string) {
    if (category !== null && categoryValue !== null) {
      const checked = this.checkboxMap.get(category).get(categoryValue);
      this.checkboxMap.get(category).set(categoryValue, !checked);
      this.filters = this.searchService.handleFilters(category, categoryValue, this.filters);
    }
    this.facetSearchText = '';
    this.uploaded.emit('emit');
  }

  clickExpand(key: string) {
    const isExpanded = this.fullyExpandMap.get(key);
    this.fullyExpandMap.set(key, !isExpanded);
  }

  returnZero() {
    return 0;
  }
}

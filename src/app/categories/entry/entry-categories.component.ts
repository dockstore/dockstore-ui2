/*
 *     Copyright 2025 OICR and UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf, LowerCasePipe } from '@angular/common';
import { ExtendedModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatChipsModule } from '@angular/material/chips';
import { CategorySummary, EntryType } from 'app/shared/openapi';
import { SearchResult } from 'app/search/state/search.query';
import { CategoryButtonComponent } from 'app/categories/button/category-button.component';

function sort_categories(categories: CategorySummary[]): CategorySummary[] {
  return [...categories].sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? ''));
}

@Component({
  selector: 'app-entry-categories',
  templateUrl: './entry-categories.component.html',
  standalone: true,
  imports: [NgIf, NgFor, LowerCasePipe, ExtendedModule, FlexLayoutModule, MatChipsModule, CategoryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryCategoriesComponent {
  @Input() entry: SearchResult;
  @Input() entryType: EntryType;
  protected readonly sort_categories = sort_categories;
}

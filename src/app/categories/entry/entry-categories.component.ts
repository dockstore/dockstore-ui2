/*
 *     Copyright 2026 OICR and UCSC
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
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { NgFor, LowerCasePipe } from '@angular/common';
import { ExtendedModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatChipsModule } from '@angular/material/chips';
import { CategorySummary, EntryType } from 'app/shared/openapi';
import { CategoryButtonComponent } from 'app/categories/button/category-button.component';

interface CategoryGroup {
  label: string;
  categories: CategorySummary[];
}

const GROUP_ORDER = ['Categories', 'Operations', 'Topics', 'Inputs', 'Outputs'] as const;
type GroupLabel = typeof GROUP_ORDER[number];

function getGroupLabel(name: string): GroupLabel {
  if (name.startsWith('operation-')) return 'Operations';
  if (name.startsWith('topic-')) return 'Topics';
  if (name.startsWith('input-')) return 'Inputs';
  if (name.startsWith('output-')) return 'Outputs';
  return 'Categories';
}

function sortCategories(categories: CategorySummary[]): CategorySummary[] {
  return [...categories].sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? ''));
}

function sortIOCategories(categories: CategorySummary[]): CategorySummary[] {
  const formats = categories.filter((c) => (c.name ?? '').startsWith('input-format-') || (c.name ?? '').startsWith('output-format-'));
  const data = categories.filter((c) => (c.name ?? '').startsWith('input-data-') || (c.name ?? '').startsWith('output-data-'));
  return [...sortCategories(formats), ...sortCategories(data)];
}

const IO_LABELS = new Set<GroupLabel>(['Inputs', 'Outputs']);

function groupCategories(categories: CategorySummary[]): CategoryGroup[] {
  const map = new Map<GroupLabel, CategorySummary[]>(GROUP_ORDER.map((label) => [label, []]));
  for (const cat of categories) {
    map.get(getGroupLabel(cat.name ?? ''))!.push(cat);
  }
  return GROUP_ORDER.filter((label) => map.get(label)!.length > 0).map((label) => ({
    label,
    categories: (IO_LABELS.has(label) ? sortIOCategories : sortCategories)(map.get(label)!),
  }));
}

@Component({
  selector: 'app-entry-categories',
  templateUrl: './entry-categories.component.html',
  styleUrls: ['./entry-categories.component.scss'],
  standalone: true,
  imports: [NgFor, LowerCasePipe, ExtendedModule, FlexLayoutModule, MatChipsModule, CategoryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryCategoriesComponent implements OnChanges {
  @Input() categories: CategorySummary[] = [];
  @Input() entryType: EntryType;
  protected groups: CategoryGroup[] = [];

  ngOnChanges(): void {
    this.groups = groupCategories(this.categories ?? []);
  }
}

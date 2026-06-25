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
import { Pipe, PipeTransform } from '@angular/core';
import { CategorySummary } from 'app/shared/openapi';

export const GROUP_ORDER = ['Categories', 'Operations', 'Topics', 'Inputs', 'Outputs'] as const;
export type GroupLabel = typeof GROUP_ORDER[number];

export function getGroupLabel(name: string): GroupLabel {
  if (name.startsWith('operation-')) return 'Operations';
  if (name.startsWith('topic-')) return 'Topics';
  if (name.startsWith('input-')) return 'Inputs';
  if (name.startsWith('output-')) return 'Outputs';
  return 'Categories';
}

function sortAlphabetically(categories: CategorySummary[]): CategorySummary[] {
  return [...categories].sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? ''));
}

function sortIOCategories(categories: CategorySummary[]): CategorySummary[] {
  const formats = categories.filter((c) => (c.name ?? '').startsWith('input-format-') || (c.name ?? '').startsWith('output-format-'));
  const data = categories.filter((c) => (c.name ?? '').startsWith('input-data-') || (c.name ?? '').startsWith('output-data-'));
  return [...sortAlphabetically(formats), ...sortAlphabetically(data)];
}

const IO_LABELS = new Set<GroupLabel>(['Inputs', 'Outputs']);

/** Returns the subset of `categories` belonging to `group`, sorted appropriately. */
@Pipe({ name: 'extractCategories', standalone: true, pure: true })
export class ExtractCategoriesPipe implements PipeTransform {
  transform(categories: CategorySummary[], group: GroupLabel): CategorySummary[] {
    const members = (categories ?? []).filter((c) => getGroupLabel(c.name ?? '') === group);
    return IO_LABELS.has(group) ? sortIOCategories(members) : sortAlphabetically(members);
  }
}

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
import { SearchResult } from 'app/search/state/search.query';

@Pipe({ name: 'entryCategories', standalone: true, pure: true })
export class EntryCategoriesPipe implements PipeTransform {
  transform(entry: SearchResult): CategorySummary[] {
    const src = entry?.source;
    if (!src) return [];
    return [
      ...(src.categories ?? []),
      ...(src.operation ?? []),
      ...(src.topic ?? []),
      ...(src['input-format'] ?? []),
      ...(src['input-data'] ?? []),
      ...(src['output-format'] ?? []),
      ...(src['output-data'] ?? []),
    ];
  }
}

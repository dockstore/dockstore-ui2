/*
 * Copyright 2021 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnChanges, Input } from '@angular/core';
import { Category, CategorySummary } from '../../shared/openapi';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-category-button',
  templateUrl: './category-button.component.html',
  styleUrls: ['./category-button.component.scss'],
  standalone: true,
  imports: [MatChipsModule, RouterLink, NgClass, MatTooltipModule],
})
export class CategoryButtonComponent implements OnChanges {
  @Input() category: Category | CategorySummary;
  @Input() entryType: string;
  className: string;
  routerLink: Array<string>;
  queryParams: object;

  ngOnChanges(): void {
    const isWorkflow: boolean = this.entryType.startsWith('workflow');
    this.className = isWorkflow ? 'workflow-background' : 'tool-background';
    if ((this.category as CategorySummary).aiManaged) this.className += ' ai-managed';
    this.routerLink = ['/search'];
    this.queryParams = {
      [this.searchField()]: this.category.displayName,
      entryType: isWorkflow ? 'workflows' : 'tools',
      searchMode: 'files',
    };
  }

  private searchField(): string {
    const name = this.category.name;
    if (name.startsWith('operation-')) return 'operation.displayName.keyword';
    if (name.startsWith('topic-')) return 'topic.displayName.keyword';
    if (name.startsWith('input-data-')) return 'input-data.displayName.keyword';
    if (name.startsWith('input-format-')) return 'input-format.displayName.keyword';
    if (name.startsWith('output-data-')) return 'output-data.displayName.keyword';
    if (name.startsWith('output-format-')) return 'output-format.displayName.keyword';
    return 'categories.displayName.keyword';
  }
}

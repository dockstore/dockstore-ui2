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
import { ChangeDetectionStrategy, Component, OnChanges, Input } from '@angular/core';
import { Category, CategorySummary } from '../../shared/openapi';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

// eslint-disable-next-line
const EDAM_PREFIX = 'http://edamontology.org/';

@Component({
  selector: 'app-category-button',
  templateUrl: './category-button.component.html',
  styleUrls: ['./category-button.component.scss'],
  standalone: true,
  imports: [MatChipsModule, RouterLink, NgClass, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    if ((this.category as CategorySummary).curator == CategorySummary.CuratorEnum.AI) this.className += ' ai-managed';
    this.routerLink = ['/search'];
    this.queryParams = {
      [this.searchField()]: this.category.displayName,
      entryType: isWorkflow ? 'workflows' : 'tools',
      searchMode: 'files',
    };
  }

  get tooltip(): string {
    const parts: string[] = [];
    if (this.category.displayName) {
      const label = (this.category as CategorySummary).aiManaged ? this.categoryTypeLabel() : 'Category';
      parts.push(`${label}:`);
      parts.push(this.category.displayName);
    }
    parts.push('');
    if (this.category.topic) {
      parts.push(this.category.topic);
      parts.push('');
    }
    const source = this.category.metadata?.['source'];
    if (source === 'ai') {
      parts.push('Category created by AI.');
    } else if (source?.startsWith(EDAM_PREFIX)) {
      parts.push(`Derived from EDAM: ${source}`);
    } else {
      parts.push('Category created by Dockstore.');
    }
    const curator = (this.category as CategorySummary).curator;
    if (curator === CategorySummary.CuratorEnum.USER) {
      parts.push('Category membership approved by entry owner.');
    } else if (curator === CategorySummary.CuratorEnum.DOCKSTORE) {
      parts.push('Category membership curated by Dockstore.');
    } else if (curator === CategorySummary.CuratorEnum.AI) {
      parts.push('Category membership curated by AI.');
    }
    return parts.join('\n');
  }

  private categoryTypeLabel(): string {
    const name = this.category.name;
    if (name.startsWith('operation-')) return 'Operation';
    if (name.startsWith('topic-')) return 'Topic';
    if (name.startsWith('input-data-')) return 'Input Data';
    if (name.startsWith('input-format-')) return 'Input Format';
    if (name.startsWith('output-data-')) return 'Output Data';
    if (name.startsWith('output-format-')) return 'Output Format';
    return 'Category';
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

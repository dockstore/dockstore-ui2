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

@Component({
  selector: 'app-category-button',
  templateUrl: './category-button.component.html',
  styleUrls: ['./category-button.component.scss'],
})
export class CategoryButtonComponent implements OnChanges {
  @Input() category: Category | CategorySummary;
  @Input() entryType: string;
  className: string;
  routerLink: Array<string>;
  queryParams: object;

  ngOnChanges(): void {
    const isWorkflow: boolean = this.entryType.startsWith('workflow');
    this.className = isWorkflow ? 'workflow-label-tag' : 'container-label-tag';
    this.routerLink = ['/search'];
    this.queryParams = {'categories.name.keyword': this.category.name, 'entryType': isWorkflow ? 'workflows' : 'tools', 'searchMode': 'files'};
  }
}

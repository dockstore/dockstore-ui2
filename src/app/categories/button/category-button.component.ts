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
  queryParams: {'categories.name.keyword': string, 'entryType': string, 'searchMode': string};

  constructor() { }

  ngOnChanges(): void {
    const isWorkflow: boolean = this.entryType.startsWith('workflow');
    this.className = isWorkflow ? 'workflow-label-tag' : 'container-label-tag';
    this.routerLink = ['/search'];
    this.queryParams = {'categories.name.keyword': this.category.name, 'entryType': isWorkflow ? 'workflows' : 'tools', 'searchMode': 'files'};
  }
}

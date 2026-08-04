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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, LowerCasePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { CategorySummary, EntryType } from 'app/shared/openapi';
import { CategoryButtonComponent } from 'app/categories/button/category-button.component';

@Component({
  selector: 'app-category-buttons',
  templateUrl: './category-buttons.component.html',
  styleUrls: ['./category-buttons.component.scss'],
  imports: [NgFor, LowerCasePipe, MatChipsModule, CategoryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryButtonsComponent {
  @Input() categories: CategorySummary[] = [];
  @Input() entryType: EntryType;
}

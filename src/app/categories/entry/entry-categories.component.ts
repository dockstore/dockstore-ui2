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
import { ExtendedModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CategorySummary, EntryType } from 'app/shared/openapi';
import { CategoryButtonsComponent } from 'app/categories/buttons/category-buttons.component';
import { ExtractCategoriesPipe, GROUP_ORDER } from 'app/categories/extract-categories.pipe';

@Component({
  selector: 'app-entry-categories',
  templateUrl: './entry-categories.component.html',
  styleUrls: ['./entry-categories.component.scss'],
  standalone: true,
  imports: [ExtendedModule, FlexLayoutModule, CategoryButtonsComponent, ExtractCategoriesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryCategoriesComponent {
  @Input() categories: CategorySummary[] = [];
  @Input() entryType: EntryType;
  protected readonly groupOrder = GROUP_ORDER;
}

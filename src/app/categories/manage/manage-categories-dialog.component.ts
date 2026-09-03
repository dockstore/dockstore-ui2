/*
 *    Copyright 2026 OICR and UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { CategoriesService, CategorySummary, EntryTypeMetadata } from 'app/shared/openapi';
import { getGroupLabel, GROUP_ORDER } from 'app/categories/extract-categories.pipe';

export interface ManageCategoriesDialogData {
  categories: CategorySummary[];
  entryId: number;
  entryTypeMetadata: EntryTypeMetadata;
}

type CategoryDecision = 'approve' | 'remove';

@Component({
  selector: 'app-manage-categories-dialog',
  templateUrl: './manage-categories-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDividerModule, FlexModule, AlertComponent],
})
export class ManageCategoriesDialogComponent {
  categories: CategorySummary[];
  entryId: number;
  entryTypeMetadata: EntryTypeMetadata;
  decisions = new Map<number, CategoryDecision>();
  readonly CuratorEnum = CategorySummary.CuratorEnum;
  readonly groupOrder = GROUP_ORDER;

  constructor(
    public dialogRef: MatDialogRef<ManageCategoriesDialogComponent>,
    private categoriesService: CategoriesService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: ManageCategoriesDialogData
  ) {
    this.categories = data.categories;
    this.entryId = data.entryId;
    this.entryTypeMetadata = data.entryTypeMetadata;
  }

  categoriesForGroup(group: string): CategorySummary[] {
    return this.categories.filter((c) => getGroupLabel(c.name ?? '') === group);
  }

  decide(category: CategorySummary, decision: CategoryDecision): void {
    if (this.decisions.get(category.id) === decision) {
      this.decisions.delete(category.id);
    } else {
      this.decisions.set(category.id, decision);
    }
  }

  getDecision(category: CategorySummary): CategoryDecision | null {
    return this.decisions.get(category.id) ?? null;
  }

  pendingChanges(): CategorySummary[] {
    return this.categories.filter((c) => this.decisions.has(c.id));
  }

  save(): void {
    const calls = [];
    this.decisions.forEach((decision, categoryId) => {
      if (decision === 'approve') {
        calls.push(this.categoriesService.approveAiCuratedEntryInCategory(categoryId, this.entryId));
      } else {
        calls.push(this.categoriesService.removeAiCuratedEntryFromCategory(categoryId, this.entryId));
      }
    });

    if (calls.length === 0) {
      this.dialogRef.close();
      return;
    }

    this.alertService.start('Saving category changes');
    // Run all but one call in parallel, then run the remaining call once those complete.
    // This lets the database converge to a consistent state before the final call,
    // which triggers Elasticsearch indexing, is made.
    const lastCall = calls.pop();
    const parallelCalls$ = calls.length > 0 ? forkJoin(calls) : of(null);
    parallelCalls$.pipe(concatMap(() => lastCall)).subscribe({
      next: () => {
        this.alertService.detailedSuccess();
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.alertService.detailedError(error);
      },
    });
  }
}

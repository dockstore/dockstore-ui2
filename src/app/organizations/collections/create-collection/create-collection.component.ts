import { KeyValue, NgIf, AsyncPipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { Collection } from '../../../shared/openapi';

import { CreateCollectionQuery } from '../state/create-collection.query';
import { CreateCollectionService, FormsState } from '../state/create-collection.service';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { AlertComponent } from '../../../shared/alert/alert.component';

/**
 * This is actually both create and update collection dialog
 *
 * @export
 * @class CreateCollectionComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  templateUrl: './create-collection.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatLegacyDialogModule,
    AlertComponent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    AsyncPipe,
  ],
})
export class CreateCollectionComponent implements OnInit, OnDestroy {
  createCollectionForm: UntypedFormGroup;
  public loading$: Observable<boolean>;
  public title$: Observable<string>;
  public saveLabel$: Observable<string>;
  constructor(
    private createCollectionQuery: CreateCollectionQuery,
    private createCollectionService: CreateCollectionService,
    @Inject(MAT_DIALOG_DATA) public data: { collection: KeyValue<string, Collection> | null; mode: TagEditorMode },
    private formsManager: NgFormsManager<FormsState>
  ) {}

  ngOnInit() {
    this.loading$ = this.createCollectionQuery.loading$;
    this.title$ = this.createCollectionQuery.title$;
    this.saveLabel$ = this.createCollectionQuery.saveLabel$;
    this.createCollectionService.clearState();
    this.createCollectionForm = this.createCollectionService.createForm(this.formsManager, this.data);
    this.createCollectionService.setValues(this.data);
  }

  createCollection() {
    this.createCollectionService.createOrUpdateCollection(this.data, this.createCollectionForm);
  }

  get name(): AbstractControl {
    return this.createCollectionForm.get('name');
  }

  get topic(): AbstractControl {
    return this.createCollectionForm.get('topic');
  }

  get displayName(): AbstractControl {
    return this.createCollectionForm.get('displayName');
  }

  get description(): AbstractControl {
    return this.createCollectionForm.get('description');
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}

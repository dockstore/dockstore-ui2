import { KeyValue, NgIf, AsyncPipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { Collection } from '../../../shared/openapi';

import { CreateCollectionQuery } from '../state/create-collection.query';
import { CreateCollectionService, FormsState } from '../state/create-collection.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatDialogModule,
    AlertComponent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
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
